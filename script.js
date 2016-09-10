$(document).ready(function() {
	var time = 0;
	var second = 1000;
	var framesPerSecond = 60;
	var interval = second / framesPerSecond;

	var earthMotionMultiplier = 1 / 900;
	var moonMotionMultiplier = 1 / 200;

	var earth = $("#earth");
	var moon = $("#earth .moon");

	setInterval(function() {
		ymotion(time += interval, earth, earthMotionMultiplier);
		xmotion(time, earth, earthMotionMultiplier);
		ymotion(time, moon, moonMotionMultiplier);
		xmotion(time, moon, moonMotionMultiplier);
	}, interval);
});

function ymotion(time, element, multiplier) {
	element.css({ bottom: ((Math.sin(time * multiplier) + 1) * (element.parent().height() - element.height()) / 2) + "px" });
}

function xmotion(time, element, multiplier) {
	element.css({ left: ((Math.cos(time * multiplier) + 1) * (element.parent().width() - element.width()) / 2) + "px" });
}
