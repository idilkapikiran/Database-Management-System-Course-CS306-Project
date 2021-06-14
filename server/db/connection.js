var mysql = require('mysql');


var db = mysql.createPool({
  connectionLimit : 100,
  host: 'remotemysql.com',
  port: 3306,
  user: 'ZGzCopAgzN',
  password: 'lzyoxGiY4u',
  database: 'ZGzCopAgzN',
  multipleStatements: true
});


db.getConnection(function(err, conn) {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + conn.threadId);
});

// Export
module.exports = db;