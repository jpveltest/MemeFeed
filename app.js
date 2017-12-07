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

app.get('/mystuff', function(req, res) {
  res.sendFile(__dirname + '/public/mystuff.html');
});

app.get('/sharedwithme', function(req, res) {
  res.sendFile(__dirname + '/public/sharedwithme.html');
});
app.post('/signup', function(req, res) {
  var data = JSON.parse(Object.keys(req.body)[0]);

  var username = data.username;
  var password = hashCode(data.password);
  var email = data.email;

  database.getNumberOfDuplicateUsers(username, function(num) {
    if (num != 0) {
      res.send("taken");
    } else {
      database.addUser(username, password, email, function() {
        database.login(username, password, function(user) {
          if (user == -1) {
            user = user.toString();
          }
          res.send(user);
        });
      });
    }
  });
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

app.post('/savecontent', function(req, res) {
  var data = Object.keys(req.body)[0];
  console.log(data);
  var userId = data.match(/[0-9]+/)[0];
  console.log("userId: " + userId);
  var content = data.match(/<div class="story".*div>/)[0];

  var cleanContent = content.replace(/'/g, "`");

  database.saveContent(cleanContent, userId, null, null, function() {
    res.send("success");
  });
});

app.post('/getallusersexceptcurrent', function(req, res) {
  var userId = Object.keys(req.body)[0];
  database.getAllUsersExceptCurrent(userId, function(users) {
    res.send(users);
  });
});

app.post('/sharecontent', function(req, res) {
  var data = Object.keys(req.body)[0];
  var nums = data.substring(0, data.indexOf('"'));
  console.log(data);
  var content = data.substring(data.indexOf("<"), data.indexOf('<div class="moodal"')) + "</div>";
  var cleanContent = content.replace(/'/g, "`");

  var arr = nums.match(/[0-9]+/g);
  var userSharedBy = Number(arr.pop());
  recurse(arr.length - 1, cleanContent);
  function recurse(num, con) {
    if (num < 0) {
      return;
    }
    database.saveContent(con, null, Number(arr[num]), userSharedBy, function(users) {
      recurse(num-1, con);
    });
  }
});

http.listen(3001, function() {
  console.log('listening on *:3001');
});

var webcrawler = new wc.Webcrawler();

io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('loadMore', function(x) {
    var subreddit = "popular";
    if (x == 1) {
      subreddit = "funny";
    } else if (x == 2) {
      subreddit = "todayilearned";
    } else if (x == 3) {
      subreddit = "worldnews";
    } else if (x == 4) {
      subreddit = "news";
    } else if (x == 5) {
      subreddit = "gifs"
    }
    webcrawler.getContent("https://www.reddit.com/r/"+subreddit, function(c1) {
      webcrawler.getContent("https://www.youtube.com/feed/trending", function(cTube) {
        var c2 = [];
        for (var i = 0; i < 4; i++) {
          c2.push(cTube[Math.floor((Math.random()*(cTube.length-1)))]);
        }
        var memecenterPage = Math.floor((Math.random()*23249))+1;
        console.log("https://www.memecenter.com/page/"+memecenterPage.toString());
        webcrawler.getContent("https://www.memecenter.com/page/"+memecenterPage.toString(), function(c3) {
          var content = shuffleArray(c1.concat(c2).concat(c3));
          socket.emit('newContent', content); // socket.emit() for just that one user.
        });
      });
    });
  });

  socket.on('loadSaved', function(userId) {
    database.getSavedContent(userId, function(content) {
      socket.emit('newContent', content);
    });
  });

  socket.on('loadShared', function(userId) {
    database.getSharedContent(userId, function(result) {
      socket.emit('newContent', result);
    });
  }); 

  socket.on('disconnect', function() {
    console.log('user disconnected');
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


