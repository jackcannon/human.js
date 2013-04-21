var express = require('express');
var fs      = require('fs');
var http    = require('http');

var app = express.createServer(express.logger());

var path = __dirname + '/node_modules/human';

app.use(express.static(path));

app.configure(function(){
  app.use(express.static(path));
});

app.get('/*', function(req, res) {
    app.use(express.static(path));
    // var path = req.url;
    // res.send(fs.readFileSync(__dirname + '/' + 'humanjs/index.html', 'utf8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('Server is running on port \"' + port + '\"');
});