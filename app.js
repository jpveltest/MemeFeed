var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var db = require('./database');
var wc = require('./webcrawler');

var database = new db.Database();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', function(req, res) {
  res.sendFile(__dirname + '/public/register.html');
});

app.post('/signup', function(req, res) {
 var data = JSON.parse(Object.keys(req.body)[0]);

 var username = data.username;
 var password = hashCode(data.password);
 var email = data.email;

 database.addUser(username, password, email);

 res.send("success");
});

app.post('/login', function(req, res) {
 var data = JSON.parse(Object.keys(req.body)[0]);
 var usernameemail = data.usernameemail;
 var password = hashCode(data.password);

 database.login(usernameemail, password, function(user) {
  if (user == -1) {
    user = user.toString();
  }
  res.send(user);
 });
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

var webcrawler = new wc.Webcrawler();

webcrawler.getContent("https://www.reddit.com", function(c1) {
  webcrawler.getContent("https://www.youtube.com/feed/trending", function(c2) {
    webcrawler.getContent("https://www.memecenter.com", function(c3) {
      var content = shuffleArray(c1.concat(c2).concat(c3));

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
  });
});

function hashCode(s) {
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


