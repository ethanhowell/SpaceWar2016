$(document).ready(function() {
	var time = 0;
	var time2 = 0;

	window.setInterval(function() {
		ymotion(time += 1000 / 60, $(".square"));
		xmotion(time, $(".square"));
	}, 1000 / 60);
});

function ymotion(time, box) {
	box.css({ bottom: (Math.sin(time / 800) * 200 + 200) + "px" });
}

function xmotion(time, box) {
	box.css({ left: ((Math.cos(time / 800) * 200 + 200) + "px") });
}
