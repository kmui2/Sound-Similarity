var express = require('express')
var app = express()
var path = require("path");
var PythonShell = require('python-shell');
var pyshell = new PythonShell('python.py');

app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
})

app.post('/sounds', function(req, res) {
  console.log("sounds post received");
  PythonShell.run('python.py', function (err, results) {
    if (err) throw err;
    console.log('results: %j', results);
    console.log('finished');
  });

  res.send('welcom');

});

app.post('/trials', function(req, res) {
  res.send({body: 'Success'});
})

