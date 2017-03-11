var config = {
	mode: "photo",
	encoding: "jpg",
	enable1Pin: 0,
	enable2Pin: 1,
	selectionPin: 7
}

var IVPort = require("../index.js");
var ivport = new IVPort(config);
var camNum = 1;
setTimeout(function() {
// 	console.log("Starting camera", camNum);
// switch (camNum) {
// case 1:
// ivport.camera1Start();
// 	break;
// case 2:
ivport.camera2Start();
// 	break;
// case 3:
// ivport.camera3Start();
// 	break;
// case 4:
// ivport.camera4Start();
// 	break;
// }
// 	camNum++;
}, 5000);

ivport.on("start", function(data) {
	console.log(data, " started.");
});

ivport.on("read", function(data) {
	console.log(data, " read.");
});

ivport.on("exit", function(data) {
	console.log(data, " exited.");
});