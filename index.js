var express = require('express')
var app = express()
const router = express.Router();
var path = require("path");
var PythonShell = require('python-shell');
var bodyParser = require('body-parser');
var fs = require('fs');
var csvWriter = require("csv-write-stream");
var writer = csvWriter({sendHeaders: false});

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
let name = '';
app.post('/sounds', function(req, res) {
  name = req.body.name;
  console.log("sounds post received");
  console.log("the name received is " + name);
  
  writer.pipe(fs.createWriteStream('public/data/judgments/'+name+'.csv', {flags: 'a'}))

  PythonShell.defaultOptions = { args: [name] };
  PythonShell.run('judgements.py', function (err, results) {
    // if (err) throw err;
    // console.log('results: %j', results);
    console.log('finished');
    res.send(trials);
  });

});



app.post('/trials', function(req, res) {
  console.log("trial request received");
  trials = JSON.parse(req.body.data).data;
  // console.log(trials);
  let isNew = req.body.isNew;
  console.log(isNew);
  console.log(isNew == "True");
  if (isNew == "True") {
    fs.appendFile('public/data/judgments/'+name+'.csv', 
      'name,datetime,block_ix,trial_ix,sound_x,sound_y,reversed,category,similarity,notes,repeat\n', 
    function (err) {
      if (err) throw err;
      console.log('Appended fields!');
    } )
  }
  
  res.send({body: 'Success'});
})

app.post('/record', function(req, res) {
  console.log("record request received");
  // console.log(req.body);
  let response = req.body;
  writer.write(response)
  // writer.end()
  res.send({body: 'Success'});
})
