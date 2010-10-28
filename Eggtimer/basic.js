/*
 * JavaScript file
 */

var SETUP_ID = 1;

var timervalue = 0;
var initialTimer = 0;
var timeoutId = null;

function init()
{
	showMainWindow();
	widget.setDisplayPortrait();
}

function startTimer() {
	var hr = parseInt(document.getElementById("hrs").value);
	var min = parseInt(document.getElementById("min").value);
	var sec = parseInt(document.getElementById("sec").value);

	timervalue = hr * 3600 + min * 60 + sec;
	initialTimer = timervalue;
	showMainWindow();
	startCountdown();
}

function startCountdown() {
	if (timeoutId) {
		clearInterval(timeoutId);
	}
	timeoutId = window.setInterval(tick, 1000);
	tick();
}

function tick() {
	if (timervalue > 0) {
		timervalue = timervalue - 1;
		var hrs = Math.floor(timervalue / 3600);
		var mins = Math.floor((timervalue % 3600) / 60);
		var sec = timervalue % 60;
		
		var sz = pad(hrs) + ":" + pad(mins) + ":" + pad(sec);
		document.getElementById("timervalue").innerHTML = sz;
		document.getElementById("sand").style.top=(50 * (initialTimer-timervalue)/initialTimer).toFixed(0) + "%";
		document.getElementById("sand-bottom").style.top=(50+(50 * timervalue/initialTimer)).toFixed(0) + "%";
		if (timervalue == 0) {
			cancelTimer();
		}
	}
}

function pad(num) {
	if (num < 10) {
		return '0' + num;
	} else {
		return num;
	}
}

function cancelTimer() {
	clearInterval(timeoutId);
	timeoutId = 0;
	timervalue = 0;
	document.getElementById("timervalue").innerHTML = "00:00:00";
	document.getElementById("sand").style.top="50%";
	document.getElementById("sand-bottom").style.top="50%";
}

function showMainWindow() {
	document.getElementById("main-window").style.display = "inherit";
	document.getElementById("time-setup").style.display = "none";
	var item = new MenuItem("Setup timer", SETUP_ID);
	item.onSelect = showTimerSetup;
	menu.append(item);
	menu.setRightSoftkeyLabel("Exit", null);
}

function showTimerSetup() {
	document.getElementById("main-window").style.display = "none";
	document.getElementById("time-setup").style.display = "inherit";
	var item = menu.getMenuItemById(SETUP_ID);
	menu.remove(item);
	menu.setRightSoftkeyLabel("Cancel", showMainWindow);
}

var paused = false;

function pauseStart() {
	if (paused) {
		startCountdown();
		document.getElementById("pausestart").style.backgroundPosition = "0px 0px";
		paused = false;
	} else {
		if (timeoutId) {
			window.clearInterval(timeoutId);
			timeoutId = null;
		}
		document.getElementById("pausestart").style.backgroundPosition = "0px 32px";
		paused = true;
	}
}