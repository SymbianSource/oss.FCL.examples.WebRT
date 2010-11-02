/*
 * JavaScript file
 */

var SETUP_ID = 1;

var timervalue = 30;
var initialTimer = 30;
var timeoutId = null;
var paused = true;
var displayUp = true;

function init()
{
	showMainWindow();
	widget.setDisplayPortrait();
	watchSensorNotifications();
	startTimer();
}

// Call this function to add a callback that will be notified of orientation
// changes
function watchSensorNotifications() {
	var sensors = device.getServiceObject("Service.Sensor", "ISensor");
	var SensorParams = {
		SearchCriterion : "Orientation"
	};
	var result = sensors.ISensor.FindSensorChannel(SensorParams);

	if (result.ErrorCode != 0) {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
		return null;
	}
	var result2 = sensors.ISensor.RegisterForNotification(
			{ ChannelInfoMap : result.ReturnValue[0], 
				ListeningType : "ChannelData" }, sensorCallback);
	if (result.ErrorCode == 0) {
		var transactionId = result.TransactionID;
		return transactionId;
	} else {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
		return null;
	}
}

function turn(up) {
	if (up != displayUp) {
		displayUp = up;
		timervalue = initialTimer - timervalue;
		showValues();
	}
}

// This function can be passed as callback to
// sensors.ISensor.RegisterForNotification method
function sensorCallback(transactionId, code, result) {
	if (result.ErrorCode == 0) {
		var dataType = result.ReturnValue.DataType;
		var orientation = result.ReturnValue.DeviceOrientation;

		if (orientation == "DisplayUp") {
			turn(true);
		} else if (orientation == "DisplayDown") {
			turn(false);
		}
	} else {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
	}
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

function showValues() {
	var hrs = Math.floor(timervalue / 3600);
	var mins = Math.floor((timervalue % 3600) / 60);
	var sec = timervalue % 60;
	
	var sz = pad(hrs) + ":" + pad(mins) + ":" + pad(sec);
	document.getElementById("timervalue").innerHTML = sz;
	var sand=document.getElementById("sand");
	var sandBottom = document.getElementById("sand-bottom");
	var top, bottom;
	top = (50 * (initialTimer-timervalue)/initialTimer).toFixed(0) + "%";
	bottom = "50%";
	if (displayUp) {
		sand.style.top = top;
		sand.style.bottom = bottom;
	} else {
		sandBottom.style.bottom = top;
		sandBottom.style.top = bottom;
	}
	bottom = "0%";
	top = (50 + (50 * timervalue/initialTimer)).toFixed(0) + "%";
	if (displayUp) {
		sandBottom.style.top = top;
		sandBottom.style.bottom = bottom;
	} else {
		sand.style.top = bottom;
		sand.style.bottom = top;
	}
}

function tick() {
	if (timervalue > 0) {
		timervalue = timervalue - 1;
		showValues();
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