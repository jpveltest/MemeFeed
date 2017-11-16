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

Database.prototype.addUser = function(username, pass, email) {
  var sql = "INSERT INTO users VALUES (DEFAULT, '"+username+"', '"+pass+"', '"+email+"');";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Added user: " + username);
  });
}

exports.Database = Database;