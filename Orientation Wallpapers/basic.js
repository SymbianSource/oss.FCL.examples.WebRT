/*
 * JavaScript file
 */

function init()
{
	widget.setDisplayPortrait();
	watchSensorNotifications();
}

// Call this function to add a callback that will be notified of orientation changes
function watchSensorNotifications() {
	var sensors = device.getServiceObject("Service.Sensor", "ISensor");
	var SensorParams = {
		SearchCriterion : "Orientation" // TODO Possible values (one of):
			// SearchCriterion : "All"
			// SearchCriterion : "AccelerometerAxis"
			// SearchCriterion : "AccelerometerDoubleTapping"
			// SearchCriterion : "Rotation"
	};
	var result = sensors.ISensor.FindSensorChannel(SensorParams);

	if (result.ErrorCode != 0) {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
		// TODO Handle error
		return null;
	}
    // TODO Function named "sensorCallback" will be called when device orientation changes. This function should be created. 
	var result2 = sensors.ISensor.RegisterForNotification(
			{ ChannelInfoMap : result.ReturnValue[0], 
				ListeningType : "ChannelData" }, sensorCallback);
	if (result.ErrorCode == 0) {
		var transactionId = result.TransactionID;
		// TODO Use this transaction ID to cancel notifications when watching orientation is no longer needed
		return transactionId;
	} else {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
		// TODO Handle error
		return null;
	}
}

// This function can be passed as callback to 
// sensors.ISensor.RegisterForNotification method
function sensorCallback(transactionId, code, result) {
	if (result.ErrorCode == 0) {
		// TODO Process notification
		var dataType = result.ReturnValue.DataType; // One of: "AxisData", "DoubleTappingData", "OrientationData" or "RotationData"
		var orientation = result.ReturnValue.DeviceOrientation; // Orientation
		// var xAxis = result.ReturnValue.XAxisData; // Accelerometer
		// var yAxis = result.ReturnValue.YAxisData; // Accelerometer
		// var zAxis = result.ReturnValue.ZAxisData; // Accelerometer
		// var direction = result.ReturnValue.DeviceDirection; // Accelerometer double tapping
		// var xRotation = result.ReturnValue.XRotation; // Rotation
		// var yRotation = result.ReturnValue.YRotation; // Rotation
		// var zRotation = result.ReturnValue.ZRotation; // Rotation
		setVisibleDiv(orientation);
	} else {
		var errorCode = result.ErrorCode;
		var errorMessage = result.ErrorMessage;
		// TODO Handle error
	}
}

function setVisibleDiv(orientation) {
	var elements = document.getElementsByTagName("div");
	for ( var i = 0; i < elements.length; i++) {
		var el = elements[i];
		el.style.display = el.id == orientation ? "inherit" : "none";
	}
	document.getElementById("orientation").innerHTML = orientation;
}