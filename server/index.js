const express = require('express');
const volleyball = require('volleyball'); //morgan yerine bunu kullandik

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

/*app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'URLs to trust of allow');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if ('OPTIONS' == req.method) {
  res.sendStatus(200);
  } else {
    next();
  }
});*/


//HTTP request logger middleware for nodejs //debugger gibi
app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

// added on sprint 2


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