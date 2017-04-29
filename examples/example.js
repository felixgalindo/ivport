var config = {
	mode: "photo",
	encoding: "jpg",
	enable1Pin: 0,
	enable2Pin: 1,
	selectionPin: 7,
	rot: 0
}

var IVPort = require("../index.js");
var ivport = new IVPort(config);
setTimeout(function() {
	var date = new Date().toISOString()
	var filepath = "./test-pics/cam" + 1 + "-" + date + ".jpg";
	ivport.cameraStart(1, filepath, function(err, filepath) {
		if (err) {
			console.log(err);
		} else {
			console.log("Pic saved to ", filepath);
		}
		date = new Date().toISOString()
		filepath = "./test-pics/cam" + 2 + "-" + date + ".jpg";
		ivport.cameraStart(2, filepath, function(err, filepath) {
			if (err) {
				console.log(err);
			} else {
				console.log("Pic saved to ", filepath);
			}
			date = new Date().toISOString()
			filepath = "./test-pics/cam" + 3 + "-" + date + ".jpg";
			ivport.cameraStart(3, filepath, function(err, filepath) {
				if (err) {
					console.log(err);
				} else {
					console.log("Pic saved to ", filepath);
				}
				date = new Date().toISOString()
				filepath = "./test-pics/cam" + 4 + "-" + date + ".jpg";
				ivport.cameraStart(4, filepath, function(err, filepath) {
					if (err) {
						console.log(err);
					} else {
						console.log("Pic saved to ", filepath);
					}
				});
			});
		});
	});
}, 1000);
