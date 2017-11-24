function Database() {
  var mysql = require('mysql');

  this.con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "memefeed_db"
  });

  this.con.connect(function(err) {
    if (err) throw err;
      console.log("Connected!");
    });
}

Database.prototype.addUser = function(username, pass, email, callback) {
  var sql = "INSERT INTO users VALUES (DEFAULT, '"+username+"', '"+pass+"', '"+email+"');";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    console.log("Added user: " + username);
    callback();
  });
}

Database.prototype.login = function(usernameemail, pass, callback) {
  var sql = "SELECT id, username FROM users WHERE (username = '"+usernameemail+"' OR email = '"+usernameemail+"') AND pass = '"+pass+"';";
  console.log(sql);
  this.con.query(sql, function(err, result) {
    if (err) throw err;

    var r = -1;
    if (result.length != 0) {
      r = result[0];
    }
    callback(r);
  });
}

Database.prototype.getNumberOfDuplicateUsers = function(username, callback) {
  var sql = "SELECT username FROM users WHERE username = '"+username+"';";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    callback(result.length);
  });
}

exports.Database = Database;