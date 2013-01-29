var OpenNI = require('openni'),
	app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	fs = require('fs')

app.listen(8081);

function handler (req, res) {

	if(req.url==='/'){
		fs.readFile(__dirname + '/index.html',
		  function (err, data) {
		    if (err) {
		      res.writeHead(500);
		      return res.end('Error loading index.html');
		    }
		    res.writeHead(200);
		    res.end(data);
		  });
	}
	if(req.url==='/kinetic-v4.3.1.min.js'){
		fs.readFile(__dirname + '/kinetic-v4.3.1.min.js',
		  function (err, data) {
		    if (err) {
		      res.writeHead(500);
		      return res.end('Error loading index.html');
		    }
		    res.writeHead(200);
		    res.end(data);
		  });
	}
  
}



var context = OpenNI();




io.sockets.on('connection', function (socket) {
  //socket.emit('news', { hello: 'world' });

  	[
	'newuser',
	'userexit',
	'lostuser',
	'posedetected',
	'calibrationstart',
	'calibrationsucceed',
	'calibrationfail'
	].forEach(function(eventType) {
		context.on(eventType, function(userId) {
			console.log('User %d emitted event: %s', userId, eventType);
			socket.emit(eventType, {"u":userId, "e":eventType})
		});
	});
	
	[
	"head",
	"neck",
	"left_shoulder",
	"right_shoulder",
	"torso",
	"left_elbow",
	"right_elbow",
	"left_wrist",
	"right_wrist",
	"left_hand",
	"right_hand",
	"left_hip",
	"left_knee",
	"right_hip",
	"right_knee",
	"left_ankle",
	"right_ankle",
	"left_foot",
	"right_foot"
	].forEach(function(jointName) {
		console.log("Registering "+jointName);
		context.on(jointName, function(user, x, y, z) {
			//console.log(jointName + ' of user %d moved to (%d, %d, %d)', user, x, y, z);
			socket.emit(jointName, { "x":x, "y": y, "z": z });
		});
	});
});


[
  "head",
  "neck",
  "torso",
  "waist",
  "left_collar",
  "left_shoulder",
  "left_elbow",
  "left_wrist",
  "left_hand",
  "left_fingertip",
  "right_collar",
  "right_shoulder",
  "right_elbow",
  "right_wrist",
  "right_hand",
  "right_fingertip",
  "left_hip",
  "left_knee",
  "left_ankle",
  "left_foot",
  "right_hip",
  "right_knee",
  "right_ankle",
  "right_foot"
].forEach(function(jointName) {

  context.on(jointName, function(user, x, y, z) {
    console.log(jointName + ' of user %d moved to (%d, %d, %d)', user, x, y, z);
  });

});

// io.sockets.on('connection', function (socket) {
	
// });

// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });