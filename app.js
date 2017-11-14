var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./database');
var wc = require('./webcrawler');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

//var database = new db.Database();
var webcrawler = new wc.Webcrawler();

webcrawler.getContent("https://www.reddit.com", function(content) {
  //console.log(content);

  io.on('connection', function(socket) {
    console.log('a user connected');

    socket.on('loadMore', function(x) {
      socket.emit('newContent', content); // socket.emit() for just that one user.
    });


    socket.on('disconnect', function() {
      console.log('user disconnected');
    });

  });

});




