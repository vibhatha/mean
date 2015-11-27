/*var PythonShell = require('python-shell');

//python script starts

var str='';
var options = {
  mode: 'text',
  pythonPath: '/usr/bin/python3',
  pythonOptions: ['-u'],
  scriptPath: 'scripts/',
  args: []
};

PythonShell.run('svmalgo.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  //console.log('results: %j', results);
    
  var len = results.length;
  console.log("Length : "+len);
  
	for(var i=0; i<len ; i++){
		console.log(results[i]);
        str+= results[i];
	}

});


module.exports = function(){
    str+='\nResults from Intelligence'
    //return str;
}*/