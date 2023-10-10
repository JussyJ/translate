const https = require('https');
const fs = require('fs');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
var indexRouter = require('./routes/index');
var translateRouter = require('./routes/translate');
var path = require('path');

const app = express();
app.disable('x-powered-by');

require('dotenv').config({
  path: `${__dirname}/.env`
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Local ssl certificates
const privateKey = fs.readFileSync('ssl/_localhost.key', 'utf8');
const certificate = fs.readFileSync('ssl/_localhost.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(cors());
app.use(express.static('docs'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpsServer = https.createServer(credentials, app);

app.use('/', indexRouter);
app.use('/translate', translateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

httpsServer.listen(443);
console.log('HTTPS listening on: 443');
