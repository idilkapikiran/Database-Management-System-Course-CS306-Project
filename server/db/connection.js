var mysql = require('mysql');


var db = mysql.createConnection({
  host: 'remotemysql.com',
  port: 3306,
  user: 'ZGzCopAgzN',
  password: 'lzyoxGiY4u',
  database: 'ZGzCopAgzN'
});


db.connect(function(err) {
    if (err) {
      console.log('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + db.threadId);
});

// Export
module.exports = db;