var renderID;
var container_width;
var container_height;

$(document).ready(function() {
	container_height = $(".container").height();
	container_width = $(".container").width();

	box = new Body($(".box"));
	beginRender();

	// $(document).keydown(function(e) {
	// 	switch (e.keyCode) {
	// 		case 87:
	// 			box.vy += Math.cos(box.theta) * .001;
	// 			box.vx += Math.sin(box.theta) * .001;
	// 			break;
	// 		case 65:
	// 			box.theta -= .2;
	// 			break;
	// 		case 83:
	// 			box.vy -= Math.cos(box.theta) * .001;
	// 			box.vx -= Math.sin(box.theta) * .001;
	// 			break;
	// 		case 68:
	// 			box.theta += .2;
	// 			break;
	// 	}
	// });

});

var Body = function(element) {
	this.element = element;
	this.width = element.width();
	this.height = element.height();

	this.x = container_width / 5;
	this.y = container_height * 4 / 5;

	this.vx = 0;
	this.vy = 0;


	this.ax = 0;
	this.ay = 0;

	this.theta = 0;
	this.omega = 0;
	this.alpha = 0;

	this.rx, this.ry, this.sqrdDistToBlackhole;
}

function physicsEngine(interval) {
	box.rx = box.x - container_width / 2;
	box.ry = box.y - container_height / 2;
	box.sqrdDistToBlackhole = box.rx * box.rx + box.ry * box.ry;
	//console.log(box.sqrdDistToBlackhole);

	var gravity = -5 / box.sqrdDistToBlackhole;

	box.ax = gravity * box.rx / Math.sqrt(box.sqrdDistToBlackhole);
	box.ay = gravity * box.ry / Math.sqrt(box.sqrdDistToBlackhole);

	box.x += box.vx * interval + .5 * box.ax * interval * interval;
	box.y += box.vy * interval + .5 * box.ay * interval * interval;
	box.y = modulus(box.y, container_height);
	box.x = modulus(box.x, container_width);

	box.vx += box.ax * interval;
	box.vy += box.ay * interval;

	box.theta += box.omega * interval + .5 * box.alpha * interval * interval;
	box.omega += box.alpha * interval;

	box.theta = Math.atan2(-box.vy, box.vx) + Math.PI / 2;

	if(Math.sqrt(box.sqrdDistToBlackhole) < Math.min(container_width, container_height) / 20) {
		box.x = Math.random() * container_width;
		box.y = Math.random() * container_height;
		box.vx = Math.random() * container_width / 1000;
		box.vy = Math.random() * container_height / 1000;
		//box.theta = Math.atan2(box.vy, box.vx) - Math.PI / 2;
	}
}

function render(startInterval, timestamp) {
	var interval = timestamp - startInterval;
	physicsEngine(interval);

	box.element.css('bottom', (box.y - box.height / 2) + 'px');
	box.element.css('left', (box.x - box.width / 2) + 'px');
	box.element.css({ 'transform': 'rotate(' + box.theta + 'rad)' });

	//draws dots to show the path the box is taking
	/* $("<div class=\"dot\"></div>").css({
		"bottom": box.y + 'px',
		"left": box.x + 'px'
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

function modulus(dividend, divisor) {
	remainder = dividend % divisor;
	return remainder >= 0 ? remainder : divisor + remainder;
}

$(window).resize(function() {
	container_height = $(".container").height();
	container_width = $(".container").width();
	box.width = $(".box").width();
	box.height = $(".box").height();
});
