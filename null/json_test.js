var fs = require('fs');
var csvWriter = require("csv-write-stream")
var writer = csvWriter({sendHeaders: false})
writer.pipe(fs.createWriteStream('out.csv', {flags: 'a'}))
writer.write({hello: "world", foo: "bar", baz: "ilkyu"})
writer.end()