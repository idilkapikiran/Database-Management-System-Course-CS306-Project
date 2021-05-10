const express = require('express');
const volleyball = require('volleyball'); //morgan yerine bunu kullandik
const path = require('path');
const adminPanel = require('./admin/panel');

var options = {
	host: 'remotemysql.com',
	port: 3306,
	user: 'ZGzCopAgzN',
	password: 'lzyoxGiY4u',
	database: 'ZGzCopAgzN'
};
//s2
const app = express();

//HTTP request logger middleware for nodejs //debugger gibi
app.use(volleyball);
app.use(express.urlencoded());

//app.use( '/' , express.static(path.join(__dirname ,'..' ,'public')));

app.use(express.static("public"))

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/../index.html'));
  //__dirname : It will resolve to your project folder.
});

app.use('/admin', adminPanel);

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