var renderID;
var container_width;
var container_height;
var engineStrength = .0001;
var gravityStrength = -4;
var turnConstant = .0035;
var starships = new Array();

var physicsbody = {
	element,
	width, height,
	x, y,
	vx, vy,
	ax, ay,
	gravityAcceleration,
	sqrdDistToWormhole,
	physicsEngine: function(){},
	
	starship: {
		element,
		width, height,
		x, y,
		vx, vy,
		ax, ay,
		sqrdDistToWormhole,
		physicsEngine: function(){},
		isWarping,
		userHasControl,
		engineAcceleration,
		gravityAcceleration,
		theta, omega,
		rx, ry,
		warp: function(){},
		getWarpPosition: function(){}
	},

	torpedo: {
		element,
		width, height,
		x, y,
		vx, vy,
		ax, ay,
		gravityAcceleration,
		sqrdDistToWormhole,
		physicsEngine: function(){},

		LIFETIME, SPEED_INCREASE, //Constants

		age,
		parentStarship
	}
}

window.onload = function() {
	setWindowDimensions();

	starships.push(new Starship($(".xwing"),
		container_width / 5,
		container_height * 4 / 5,
		Math.PI));
	starships.push(new Starship($(".tiefighter"), container_width * 4 / 5, container_height / 5, 0));

	beginRender();
}

$(document).keydown(handleKeydown);

$(document).keyup(handleKeyup);

$(window).resize(handleResize);


var Starship = function(element, xorigin, yorigin, orientation) {
	this.element = element;
	this.width;
	this.height;
	setBodyDimensions(this);
	this.isWarping = false;
	this.userHasControl = true;

	this.x = xorigin;
	this.y = yorigin;

	this.vx = 0;
	this.vy = 0;

	this.ax = 0;
	this.ay = 0;

	this.engineAcceleration = 0;
	this.gravityAcceleration = 0;

	this.theta = orientation;
	this.omega = 0;

	this.rx, this.ry, this.sqrdDistToWormhole;
}

function physicsEngine(interval, starship) {
	starship.rx = starship.x - container_width / 2;
	starship.ry = starship.y - container_height / 2;
	starship.sqrdDistToWormhole = starship.rx * starship.rx + starship.ry * starship.ry;

	starship.gravityAcceleration = gravityStrength / starship.sqrdDistToWormhole;

	starship.ax = starship.gravityAcceleration * starship.rx / Math.sqrt(starship.sqrdDistToWormhole) +
		starship.engineAcceleration * Math.sin(starship.theta);
	starship.ay = starship.gravityAcceleration * starship.ry / Math.sqrt(starship.sqrdDistToWormhole) +
		starship.engineAcceleration * Math.cos(starship.theta);

	starship.x += starship.vx * interval + .5 * starship.ax * interval * interval;
	starship.y += starship.vy * interval + .5 * starship.ay * interval * interval;
	starship.y = modulus(starship.y, container_height);
	starship.x = modulus(starship.x, container_width);

	starship.vx += starship.ax * interval;
	starship.vy += starship.ay * interval;

	starship.theta += starship.omega * interval;

	if (Math.sqrt(starship.sqrdDistToWormhole) < Math.min(container_width, container_height) / 20) {
		warp(starship);
	}
}

function render(startInterval, timestamp) {
	var interval = timestamp - startInterval;

	for (var i = 0; i < starships.length; i++) {
		if (!starships[i].isWarping) {
			physicsEngine(interval, starships[i]);

			starships[i].element.css('bottom', (starships[i].y - starships[i].height / 2) + 'px');
			starships[i].element.css('left', (starships[i].x - starships[i].width / 2) + 'px');
			starships[i].element.css({ 'transform': 'rotate(' + starships[i].theta + 'rad)' });
		}
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
				starships[0].omega = -turnConstant;
				break;
			case 83:
				starships[0].engineAcceleration = engineStrength;
				break;
			case 68:
				starships[0].omega = turnConstant;
				break;
		}
	}
	if (starships[1].userHasControl) {
		switch (e.keyCode) {
			// case 87:
			// 	starships[1].engineAcceleration = engineStrength;
			// 	break;
			case 74:
				starships[1].omega = -turnConstant;
				break;
			case 75:
				starships[1].engineAcceleration = engineStrength;
				break;
			case 76:
				starships[1].omega = turnConstant;
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
				starships[0].omega = 0;
				break;
			case 83:
				starships[0].engineAcceleration = 0;
				break;
			case 68:
				starships[0].omega = 0;
				break;
		}
	}
	if (starships[1].userHasControl) {
		switch (e.keyCode) {
			// case 87:
			// 	starships[1].engineAcceleration = 1;
			// 	break;
			case 74:
				starships[1].omega = 0;
				break;
			case 75:
				starships[1].engineAcceleration = 0;
				break;
			case 76:
				starships[1].omega = 0;
				break;
		}
	}
}

function handleResize() {
	setWindowDimensions();
	setBodyDimensions(starships[0]);
}
