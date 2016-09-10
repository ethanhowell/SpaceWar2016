$(document).ready(function() {
	var time = 0;
	var time2 = 0;

	window.setInterval(function() {
		ymotion(time += 1000 / 60, $("#earth"), 1/900);
		xmotion(time, $("#earth"), 1/900);
	}, 1000 / 60);

	window.setInterval(function() {
		ymotion(time2 += 1000 / 60, $("#earth .moon"), 1/200);
		xmotion(time2, $("#earth .moon"), 1/200);
	}, 1000 / 60);
});

function ymotion(time, element, multiplier) {
	
	element.css({ bottom: ((Math.sin(time * multiplier) + 1) * (element.parent().height() - element.height()) / 2) + "px" });
}

function xmotion(time, element, multiplier) {
	element.css({ left: ((Math.cos(time * multiplier) + 1) * (element.parent().width() - element.width()) / 2) + "px" });
}
