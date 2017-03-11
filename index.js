/**
 * @fileoverview API for IVPort Raspberry Pi 8MP Camera Module V2 Multiplexer
 * @author felixgalindo91@gmail.com (Felix A. Galindo)
 */

var RaspiCam = require("raspicam");
var wpi = require('wiring-pi');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var i2c = require('i2c');
var address = 0x70;
var wire = new i2c(address, {
	device: '/dev/i2c-1'
}); // point to your i2c address, debug provides REPL interface 

wire.scan(function(err, data) {
	console.log("scan:", data);
});

wire.on('data', function(data) {
	console.log("data:", data);
});

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

	ivport.cameras = [];
	ivport.cameras['camera4'] = new RaspiCam({
		mode: IVPort.config.mode,
		encoding: IVPort.config.encoding,
		output: "./test-pics/image.jpg",
		t: 10
	});

	ivport.cameras['camera4'].on("start", function(err, timestamp) {
		console.log("photo started at " + timestamp);
		ivport.emit('start', 'camera4');
	});

	ivport.cameras['camera4'].on("read", function(err, timestamp, filename) {
		console.log("photo image captured with filename: " + filename);
		ivport.emit('read', 'camera4');
	});

	ivport.cameras['camera4'].on("exit", function(timestamp) {
		console.log("photo child process has exited at " + timestamp);
		ivport.emit('exit', 'camera4');
	});
}

util.inherits(IVPort, EventEmitter);

//Starts camera 1
IVPort.prototype.camera1Start = function() {
	var ivport = this;
	wire.writeByte(0x01, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log("Wrote byte");
		}
	});
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, 0);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, 1);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, 0);
	setTimeout(function() {
		ivport.cameras['camera4'].start();
	}, 1000);
};

//Starts camera 1
IVPort.prototype.camera2Start = function() {
	var ivport = this;
	wire.writeByte(0x02, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log("Wrote byte");
		}
	});
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, 0);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, 1);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, 1);
	setTimeout(function() {
		ivport.cameras['camera4'].start();
	}, 1000);
};

//Starts camera 1
IVPort.prototype.camera3Start = function() {
	var ivport = this;
	wire.writeByte(0x04, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log("Wrote byte");
		}
	});
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, 1);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, 0);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, 0);
	setTimeout(function() {
		ivport.cameras['camera4'].start();
	}, 1000);
};

//Starts camera 1
IVPort.prototype.camera4Start = function() {
	var ivport = this;
	wire.writeByte(0x08, function(err) {
		if (err) {
			console.log(err)
		} else {
			console.log("Wrote byte");
		}
	});
	wpi.pinMode(IVPort.config.enable1Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable1Pin, 1);
	wpi.pinMode(IVPort.config.enable2Pin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.enable2Pin, 0);
	wpi.pinMode(IVPort.config.selectionPin, wpi.OUTPUT);
	wpi.digitalWrite(IVPort.config.selectionPin, 1);
	setTimeout(function() {
		ivport.cameras['camera4'].start();
	}, 1000);
};

//Stops camera 1
IVPort.prototype.camera4Stop = function() {
	var IVPort = this;
	ivport.cameras['camera4'].stop();
};

module.exports = IVPort;