var renderID;

$(document).ready(function() {
	box = new Body($(".box"));
	beginRender();

	$(document).keypress(function() {
		box.vy = 1;
	});
	
	$(document).touchstart(function(e) {
		e.preventDefault();
		box.vy = 1;
	});

});

var Body = function(element) {
	this.element = element;

	this.x = 225;
	this.y = 225;

	this.vx = 0;
	this.vy = 0;

	this.ax = 0;
	this.ay = -.003;
}

function physicsEngine(interval) {
	box.x += box.vx * interval + .5 * box.ax * interval * interval;
	box.y += box.vy * interval + .5 * box.ay * interval * interval;

	box.vx += box.ax * interval;
	box.vy += box.ay * interval;
}

function render(startInterval, timestamp) {
	var interval = timestamp - startInterval;
	physicsEngine(interval);

	box.element.css('bottom', box.y + 'px');
	box.element.css('left', box.x + 'px');

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
