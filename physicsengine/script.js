var renderID;

$(document).ready(function() {
	box = new Body($(".box"));
	beginRender();

	$(document).keydown(function(e) {
		console.log(e.keyCode);
		switch (e.keyCode) {
			case 87:
				box.vy += Math.cos(box.theta) * .1;
				box.vx += Math.sin(box.theta) * .1;
				break;
			case 65:
				box.omega -= .002;
				break;
			case 83:
				box.vy -= Math.cos(box.theta) * .1;
				box.vx -= Math.sin(box.theta) * .1;
				break;
			case 68:
				box.omega += .002;
				break;
		}
	});

});

var Body = function(element) {
	this.element = element;

	this.x = $(".container").width() / 2 - 25;
	this.y = $(".container").height() / 2 - 25;

	this.vx = .0;
	this.vy = .0;

	this.ax = 0;
	this.ay = -.000;

	this.theta = 0;
	this.omega = 0;
	this.alpha = 0;
}

function physicsEngine(interval) {
	box.x += box.vx * interval + .5 * box.ax * interval * interval;
	box.y += box.vy * interval + .5 * box.ay * interval * interval;

	box.vx += box.ax * interval;
	box.vy += box.ay * interval;

	box.theta += box.omega * interval + .5 * box.alpha * interval * interval;
	box.omega += box.alpha * interval;
}

function render(startInterval, timestamp) {
	var interval = timestamp - startInterval;
	physicsEngine(interval);

	box.element.css('bottom', (box.y = modulus(box.y, $(".container").height())) + 'px');
	box.element.css('left', (box.x = modulus(box.x, $(".container").width())) + 'px');
	box.element.css({'transform': 'rotate(' + box.theta + 'rad)'});

	//console.log(box.y);

	//draws dots to show the path the box is taking
	/* $("<div class=\"dot\"></div>").css({
		"bottom": box.y + 20 + 'px',
		"left": box.x + 20 + 'px'
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