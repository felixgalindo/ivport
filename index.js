/**
 * @fileoverview API for IVPort Raspberry Pi 8MP Camera Module V2 Multiplexer
 * @author felixgalindo91@gmail.com (Felix A. Galindo)
 */

var RaspiCam = require("raspicam");
var wpi = require('wiring-pi');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var i2c = require('i2c');

//I2C stuff...
var address = 0x70;
var wire = new i2c(address, {
	device: '/dev/i2c-1'
});

wire.scan(function(err, data) {
	console.log("scan:", data);
});

wire.on('data', function(data) {
	console.log("data:", data);
});

var cameraMap = {
	1: {
		writeValue: 0x01,
		enable1PinVal: 0,
		enable2PinVal: 1,
		selPinVal: 0,
	},
	2: {
		writeValue: 0x02,
		enable1PinVal: 0,
		enable2PinVal: 1,
		selPinVal: 1,
	},
	3: {
		writeValue: 0x04,
		enable1PinVal: 1,
		enable2PinVal: 0,
		selPinVal: 0,
	},
	4: {
		writeValue: 0x08,
		enable1PinVal: 1,
		enable2PinVal: 0,
		selPinVal: 1,
	},
};

//IVPort class
function IVPort(config) {
	console.log("Initializing IVPort");
	var ivport = this;
	IVPort.config = config;
	wpi.setup("wpi");

	//Set pins enable pins high to deselect all cameras
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, 1);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, 1);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, 1);

	ivport.filepath = "./test-pics/ivport-temp.jpg";
	ivport.camera = new RaspiCam({
		mode: IVPort.config.mode,
		encoding: IVPort.config.encoding,
		output: ivport.filepath,
		t: 10
	});

	ivport.busy = false;
	ivport.callback = null;
	ivport.error = false;

	ivport.camera.on("start", function(err, timestamp) {
		console.log("photo started at " + timestamp);
		ivport.emit('start', 'camera');
	});

	ivport.camera.on("read", function(err, timestamp, filename) {
		if (filename === "ivport-temp.jpg") {
			console.log("photo image captured with filename: " + filename);
			copyFile("./test-pics/ivport-temp.jpg", ivport.filepath, function() {});
		}
	});

	ivport.camera.on("exit", function(timestamp) {
		console.log("photo child process has exited at " + timestamp);
		ivport.emit('exit', 'camera');
		ivport.busy = false;
		if (ivport.callback) {
			ivport.callback(null, ivport.filepath);
		}
	});
}

util.inherits(IVPort, EventEmitter);

IVPort.prototype.cameraStart = function(camera, filepath, callback) {
	var ivport = this;
	if (ivport.busy) {
		callback("IVPort is busy", null);
		return;
	}
	ivport.busy = true;
	ivport.callback = callback;
	wire.writeByte(cameraMap[camera].writeValue, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log("Wrote value", cameraMap[camera].writeValue);
		}
	});
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, cameraMap[camera].enable1PinVal);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, cameraMap[camera].enable2PinVal);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, cameraMap[camera].selPinVal);
	ivport.filepath = filepath;
	setTimeout(function() {
		ivport.camera.start();
	}, 10);
};

function copyFile(source, target, cb) {
	var cbCalled = false;

	var rd = fs.createReadStream(source);
	rd.on("error", function(err) {
		done(err);
	});
	var wr = fs.createWriteStream(target);
	wr.on("error", function(err) {
		done(err);
	});
	wr.on("close", function(ex) {
		done();
	});
	rd.pipe(wr);

	function done(err) {
		if (!cbCalled && cb) {
			cb(err);
			cbCalled = true;
		}
	}
}

module.exports = IVPort;