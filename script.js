$(document).ready(function() {
	var time = 0;
	var time2 = 0;

	window.setInterval(function() {
		ymotion(time += 1000 / 60, $("#earth"));
		xmotion(time, $("#earth"));
	}, 1000 / 60);
});

function ymotion(time, element) {
	element.css({ bottom: ((Math.sin(time / 800) + 1) * ($(window).height() - element.height()) / 2) + "px" });
}

function xmotion(time, element) {
	element.css({ left: ((Math.cos(time / 800) + 1) * ($(window).width() - element.width()) / 2) + "px" });
}
