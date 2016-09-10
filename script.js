const second = 1000;
const framesPerSecond = 60;
const interval = second / framesPerSecond;

$(document).ready(function() {
	var time = 0;

	var earthSystemMotionMultiplier = setMultiplier(10);
	var moonMotionMultiplier = setMultiplier(5 / 6);

	var earthSystem = $("#earthSystem");
	var moon = $("#earthSystem .moon");

	setInterval(function() {
		ymotion(time += interval, earthSystem, earthSystemMotionMultiplier, 400);
		xmotion(time, earthSystem, earthSystemMotionMultiplier, 600);
		ymotion(time, moon, moonMotionMultiplier, 100);
		xmotion(time, moon, moonMotionMultiplier, 140);
		// var angle = Math.atan2(earthSystem.parent().height()  / 2 - earthSystem.position().top, earthSystem.parent().width() / 2 - earthSystem.position().left);
		// var angle1 = Math.atan2(moon.parent().height()  / 2 - moon.position().top, moon.parent().width() / 2 - moon.position().left);
		// $("#sun").css({transform: "rotateZ(" + angle + "rad)"});
		// $("#rock").css({transform: "rotateZ(" + angle1 + "rad)"});
	}, interval);
});

function ymotion(time, element, multiplier, distanceToCenter) {
	element.css({ bottom: (((Math.sin(time * multiplier)) * (distanceToCenter) + (element.parent().height() - element.height()) / 2)) + "px" });
}

function xmotion(time, element, multiplier, distanceToCenter) {
	element.css({ left: (((Math.cos(time * multiplier)) * (distanceToCenter) + (element.parent().width() - element.width()) / 2)) + "px" });
}

function setMultiplier(secondsPerRevolution) {
	return 2 * Math.PI / (second * secondsPerRevolution);
}
