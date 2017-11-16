var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var db = require('./database');
var wc = require('./webcrawler');

var database = new db.Database();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/register', function(req, res){
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

http.listen(3001, function() {
  console.log('listening on *:3001');
});

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

function hashCode(s) {
  return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}



