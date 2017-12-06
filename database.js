function Database() {
  var mysql = require('mysql');

  this.con = mysql.createConnection({
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "b63d5307eba7e3",
    password: "ffd6cbc0",
    database: "heroku_ee7f123ea9dc92e"
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

Database.prototype.saveContent = function(content, userSave, userSharedTo, userSharedBy, callback) {
  var sql = "INSERT INTO contents VALUES (DEFAULT, '"+content+"', "+userSave+", "+userSharedTo+", "+userSharedBy+", CURRENT_TIMESTAMP);";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    callback();
  });
}

Database.prototype.getSavedContent = function(userId, callback) {
  var sql = "SELECT content FROM contents WHERE user_save = "+userId+";";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    callback(result);
  });
}

Database.prototype.getAllUsersExceptCurrent = function(userId, callback) {
  var sql = "SELECT username, id FROM users WHERE id <> "+userId+";";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    callback(result);
  });
}

Database.prototype.getSharedContent = function(userSharedTo, callback) {
  var sql = "SELECT c.content, u.username username_shared_by, c.date_added "+
    "FROM contents c "+
    "INNER JOIN users u ON c.user_shared_by = u.id "+
    "WHERE c.user_shared_to = "+userSharedTo+";";
  console.log(sql);
  this.con.query(sql, function (err, result) {
    if (err) throw err;

    callback(result);
  });
}











exports.Database = Database;