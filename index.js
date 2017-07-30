// Dependencies
const express = require('express');
const path = require("path");
const PythonShell = require('python-shell');
const bodyParser = require('body-parser');
const fs = require('fs');
const csvWriter = require("csv-write-stream");

const app = express();
const writer = csvWriter({sendHeaders: false});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Renders HTML
app.set('port', (process.env.PORT || 8000))
app.use(express.static(__dirname + '/public'))
app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/public/index.html'));
})

// POST for gnerating trials
var trials = {};
app.post('/sounds', function(req, res) {
  console.log("sounds post received");
  let name = req.body.name;
  console.log("the name received is " + name);
  PythonShell.defaultOptions = { args: [name] };
  PythonShell.run('judgements.py', function (err, results) {
    // res.send(results);
    res.send(trials);
  });

});


// POST for receiving trials from python
app.post('/trials', function(req, res) {
  trials = JSON.parse(req.body.data).data;

  // Create csv headers if new file
  if (req.body.isNew == "True") {
    fs.appendFile('public/data/judgments/'+req.body.name+'.csv', 
      'name,datetime,block_ix,trial_ix,sound_x,sound_y,reversed,category,similarity,notes,repeat,response_time,workerId,assignmentId,hitId\n', 
    function (err) {
      if (err) throw err;
    } )
  }
  
  res.send({body: 'Success'});
})

app.post('/record', function(req, res) {
  let response = req.body;
  writer.pipe(fs.createWriteStream('public/data/judgments/'+response.name+'.csv', {flags: 'a'}));
  writer.write(response);
  res.send({body: 'Success'});
})
