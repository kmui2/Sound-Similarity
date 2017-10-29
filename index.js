// Dependencies
const express = require('express');
const path = require("path");
const PythonShell = require('python-shell');
const bodyParser = require('body-parser');
const fs = require('fs');
const csvWriter = require("csv-write-stream");

const app = express();
let writer = csvWriter({sendHeaders: false});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Renders HTML
app.set('port', (process.env.PORT || 7073))


// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static(__dirname + '/dev'))
app.listen(app.get('port'), function () {
  console.log("Node app is running at http://localhost:" + app.get('port'))
})
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname + '/dev/index.html'));
})

// POST for gnerating trials
var trials = {};
app.post('/trials', function(req, res) {
  console.log("sounds post received");
  let subjCode = req.body.subjCode;
  console.log("the subjCode received is " + subjCode);
  PythonShell.defaultOptions = { args: [subjCode] };
  PythonShell.run('judgements.py', function (err, results) {
    // res.send(results);
    res.send({success:true, trials: trials});
  });

});


// POST for receiving trials from python
app.post('/send', function(req, res) {
  console.log("send post received");
  console.log(req.body);
  trials = JSON.parse(req.body.data).data;

  // Create csv headers if new file
  if (req.body.isNew == "True") {
    fs.appendFile('data/'+req.body.name+'.csv', 
      'name,datetime,block_ix,trial_ix,sound_x,sound_y,reversed,category,similarity,notes,repeat,response_time,workerId,assignmentId,hitId\n', 
    function (err) {
      if (err) throw err;
    } )
  }
  
  res.send({body: 'Success'});
})

// POST endpoint for receiving trial responses
app.post('/record', function (req, res) {
  console.log('data post request received');

  // Parses the trial response data to csv
  let response = req.body;
  console.log(response);
  let path = 'data/'+response.subjCode+'_data.csv';
  let headers = Object.keys(response);
  if (!fs.existsSync(path))
    writer = csvWriter({ headers: headers});
  else
    writer = csvWriter({sendHeaders: false});

  writer.pipe(fs.createWriteStream(path, {flags: 'a'}));
  writer.write(response);
  writer.end();

  res.send({success: true});
})
