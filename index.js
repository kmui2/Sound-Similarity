const express = require('express')
const app = express()
const path = require("path");
const PythonShell = require('python-shell');
const bodyParser = require('body-parser');
const fs = require('fs');
const csvWriter = require("csv-write-stream");
const writer = csvWriter({sendHeaders: false});

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
    res.send(trials);
  });

});



app.post('/trials', function(req, res) {
  trials = JSON.parse(req.body.data).data;
  if (req.body.isNew == "True") {
    fs.appendFile('public/data/judgments/'+name+'.csv', 
      'name,datetime,block_ix,trial_ix,sound_x,sound_y,reversed,category,similarity,notes,repeat,response_time\n', 
    function (err) {
      if (err) throw err;
    } )
  }
  
  res.send({body: 'Success'});
})

app.post('/record', function(req, res) {
  let response = req.body;
  writer.write(response)
  res.send({body: 'Success'});
})
