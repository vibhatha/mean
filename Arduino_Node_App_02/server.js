var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

//connect away
MongoClient.connect('mongodb://127.0.0.1:27017/arduino-mean-1', function(err, db) {
  if (err) throw err;
  console.log("Connected to Database");
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;

var serialPort = new SerialPort("COM10", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

serialPort.on("open", function () {
  console.log('open');
  serialPort.on('data', function(data) {
    console.log(data);
      var document = {id:"data-"+data, value:data};
      db.collection('data1').insert(document, function(err, records) {
		if (err) throw err;
		console.log("Record added as "+records);
	});
});
  });
});





  //simple json record
	
  
	//insert record
	