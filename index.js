var express = require('express')
var app = express()
var path = require("path");

// spawn_python.js
var util = require("util");

var spawn = require("child_process").spawn;
var judements = spawn('python',["judements.py"]);

app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'))

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/sounds', function(req, res) {
  
  judements.stdout.on('data',function(chunk){
      var textChunk = chunk.toString('utf8');// buffer to string
      util.log(textChunk);
  });
  res.send({body: 'Success'});
})

// spawn_python.js
var util = require("util");

var spawn = require("child_process").spawn;
var pyprocess = spawn('python',["python.py"]);

util.log('readingin')

pyprocess.stdout.on('data',function(chunk){

    var textChunk = chunk.toString('utf8');// buffer to string
    util.log(textChunk);
});
