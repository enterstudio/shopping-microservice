import {} from 'dotenv/config'
const http = require('http');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidation = require('express-validation');
const expressValidator = require('express-validator');
const APIError = require('./helpers/APIError');
const Validator = require('./helpers/Validator')();
const httpStatus = require('http-status');
import {sequelize} from './db/connection';
const util = require('util');
// let config = require('config');
const shhh = require('shhh');

let index = require('./routes/index');
let models = require('./models/models.index');
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('env', process.env.NODE_ENV);

app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(expressValidator(Validator.customValidators));
// app.use(expressValidator({
//     customValidators: {
//         enum: (input, options) => options.includes(input)
//     }
// }));



app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.all('/*', function (req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Admin-Token,X-Api-Key,X-Vendor-Key,Authorization');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

//don't show the log when it is test
// shhh.enable();


app.get('/', (req, res, next) => {
    res.redirect('/api/v1/shopping/')
});


app.use('/api/v1/shopping', index);

sequelize
    .authenticate()
    .then(function (result) {
        console.log('MySQL Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err.message);
    });

let auth = require('http-auth');
let basic = auth.basic({
        realm: "Authorized users only"
    }, function (username, password, callback) { // Custom authentication method.
        callback(username === "visa" && password === "docs");
    }
);

app.use('/docs', auth.connect(basic));

app.use(function (req, res, next) {
    let err = new Error('API Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler, will print stacktrace
console.log(app.get('env'));
if (app.get('env') === 'development' || app.get('env') === 'local') {
    app.use(function (err, req, res, next) {
        res.status(err.statusCode || err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler, no stack traces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.statusCode || err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});


/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3500');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Server started on ${bind}`);
}

module.exports = app;
