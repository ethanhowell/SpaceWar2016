var renderID;
var container_width;
var container_height;
var engineStrength = .0001;
var gravityStrength = -4;
var turnConstant = .0035;
var starships = new Array();

$(document).ready(function() {
	setWindowDimensions();

	starships.push(new Starship($(".xwing")));
	beginRender();
});

$(document).keydown(handleKeydown);

$(document).keyup(handleKeyup);

$(window).resize(handleResize);


var Starship = function(element) {
	this.element = element;
	this.width;
	this.height;
	setBodyDimensions(this);
	this.isWarping = false;
	this.userHasControl = true;

	this.x = container_width / 5;
	this.y = container_height * 4 / 5;

	this.vx = 0;
	this.vy = 0;

	this.ax = 0;
	this.ay = 0;

	this.engineAcceleration = 0;
	this.gravityAcceleration = 0;

	this.theta = Math.PI;
	this.omega = 0;

	this.rx, this.ry, this.sqrdDistToWormhole;
}

function physicsEngine(interval) {
	starships[0].rx = starships[0].x - container_width / 2;
	starships[0].ry = starships[0].y - container_height / 2;
	starships[0].sqrdDistToWormhole = starships[0].rx * starships[0].rx + starships[0].ry * starships[0].ry;

	starships[0].gravityAcceleration = gravityStrength / starships[0].sqrdDistToWormhole;

	starships[0].ax = starships[0].gravityAcceleration * starships[0].rx / Math.sqrt(starships[0].sqrdDistToWormhole) +
		starships[0].engineAcceleration * Math.sin(starships[0].theta);
	starships[0].ay = starships[0].gravityAcceleration * starships[0].ry / Math.sqrt(starships[0].sqrdDistToWormhole) +
		starships[0].engineAcceleration * Math.cos(starships[0].theta);

	starships[0].x += starships[0].vx * interval + .5 * starships[0].ax * interval * interval;
	starships[0].y += starships[0].vy * interval + .5 * starships[0].ay * interval * interval;
	starships[0].y = modulus(starships[0].y, container_height);
	starships[0].x = modulus(starships[0].x, container_width);

	starships[0].vx += starships[0].ax * interval;
	starships[0].vy += starships[0].ay * interval;

	starships[0].theta += starships[0].omega * interval;

	if (Math.sqrt(starships[0].sqrdDistToWormhole) < Math.min(container_width, container_height) / 20) {
		warp(starships[0]);
	}
}

function render(startInterval, timestamp) {
	var interval = timestamp - startInterval;

	if (!starships[0].isWarping) {
		physicsEngine(interval);

		starships[0].element.css('bottom', (starships[0].y - starships[0].height / 2) + 'px');
		starships[0].element.css('left', (starships[0].x - starships[0].width / 2) + 'px');
		starships[0].element.css({ 'transform': 'rotate(' + starships[0].theta + 'rad)' });
	}

	//draws dots to show the path the starships[0] is taking
	/* $("<div class=\"dot\"></div>").css({
		"bottom": starships[0].y + 'px',
		"left": starships[0].x + 'px'
	}).appendTo(".container"); */

	if (false) { //condition to end animation
		cancelAnimationFrame(renderID);
	} else {
		startInterval = timestamp;
		renderID = requestAnimationFrame(function(timestamp) {
			render(startInterval, timestamp);
		});
	}
}

function beginRender() {
	requestAnimationFrame(function(timestamp) {
		startInterval = timestamp - 16.7;
		render(startInterval, timestamp);
	});
}

function warp(starship) {
	starship.isWarping = true;
	starship.element.css('display', 'none');
	setTimeout(function() {
		starship.element.css('display', 'block');
		starship.isWarping = false;
		starship.userHasControl = true;
	}, Math.random() * 3000);
	starship.userHasControl = false;
	getWarpPosition(starship);
	starship.vx = (2 * Math.random() - 1) * container_width * .00005;
	starship.vy = (2 * Math.random() - 1) * container_height * .00005;
	starship.theta = Math.atan2(-starship.vy, starship.vx) + Math.PI / 2;
	starship.omega = (Math.round(Math.random() - 1) | 1) * turnConstant;
	starship.engineAcceleration = 0;
}

function getWarpPosition(starship) {
	var temp = Math.random();
	var pos = (temp * .1) + (temp * .1 + .8) * Math.round(temp);
	starship.x = pos * container_width;

	temp = Math.random();
	pos = (temp * .1) + (temp * .1 + .8) * Math.round(temp);
	starship.y = pos * container_height;
}

function modulus(dividend, divisor) {
	remainder = dividend % divisor;
	return remainder >= 0 ? remainder : divisor + remainder;
}

function setWindowDimensions() {
	container_height = $(".container").height();
	container_width = $(".container").width();
	gravityStrength = -(container_height + container_width) / 200;
	console.log(gravityStrength);
}

function setBodyDimensions(body) {
	body.width = body.element.width();
	body.height = body.element.height();
}

function handleKeydown(e) {
	if (starships[0].userHasControl) {
		switch (e.keyCode) {
			// case 87:
			// 	starships[0].engineAcceleration = engineStrength;
			// 	break;
			case 65:
			case 37:
				starships[0].omega = -turnConstant;
				break;
			case 83:
			case 38:
				starships[0].engineAcceleration = engineStrength;
				break;
			case 68:
			case 39:
				starships[0].omega = turnConstant;
				break;
		}
	}
}

function handleKeyup(e) {
	if (starships[0].userHasControl) {
		switch (e.keyCode) {
			// case 87:
			// 	starships[0].engineAcceleration = 0;
			// 	break;
			case 65:
			case 37:
				starships[0].omega = 0;
				break;
			case 83:
			case 38:
				starships[0].engineAcceleration = 0;
				break;
			case 68:
			case 39:
				starships[0].omega = 0;
				break;
		}
	}
}

function handleResize() {
	setWindowDimensions();
	setBodyDimensions(starships[0]);
}
