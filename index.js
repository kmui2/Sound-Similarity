var express = require('express')
var app = express()
const router = express.Router();
var path = require("path");
var PythonShell = require('python-shell');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
})


var trials = {};

app.post('/sounds', function(req, res) {
  console.log("sounds post received");
  PythonShell.defaultOptions = { args: ['sucker'] };
  PythonShell.run('judgements.py', function (err, results) {
    // if (err) throw err;
    console.log('results: %j', results);
    console.log('finished');
    res.send(trials);
  });

});



app.post('/trials', function(req, res) {
  console.log("trial request received");
  trials = JSON.parse(req.body.data).data;
  console.log(trials);
  
  res.send({body: 'Success'});
})
