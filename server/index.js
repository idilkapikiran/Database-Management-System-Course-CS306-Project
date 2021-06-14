const express = require('express');
const volleyball = require('volleyball'); //morgan yerine bunu kullandik
const path = require('path');
const auth = require('./auth/index')
const adminPanel = require('./admin/panel');
var cors = require('cors');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
//var flash = require('connect-flash');


var options = {
	host: 'remotemysql.com',
	port: 3306,
	user: 'ZGzCopAgzN',
	password: 'lzyoxGiY4u',
	database: 'ZGzCopAgzN'
};
//s2
const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:8080', methods:['GET','POST', 'OPTIONS'],
}));
var sessionStore = new MySQLStore(options);
app.use(session({
	secret: 'session_cookie_secret',
	store: sessionStore,
  cookie:{
    maxAge:60000000,
    httpOnly:false,
    secure:false // for normal http connection if https is there we have to set it to true
    },
  saveUninitialized: true,
  resave: true,
  rolling: false
}));
//s2


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
//app.use(flash());

//HTTP request logger middleware for nodejs //debugger gibi
app.use(volleyball);
app.use(express.json());
//app.use(express.urlencoded());

//app.use( '/' , express.static(path.join(__dirname ,'..' ,'public')));

//app.use(express.static("public"))

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../index.html'));
  //__dirname : It will resolve to your project folder.
});

app.use('/admin', adminPanel);
app.use('/auth', auth);
//end of sprint 2

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

//app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port', port);
});