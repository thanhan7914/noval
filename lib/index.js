const express = require('express');
const config = require('../lib/config');
const path = require('path');
const favicon = require('serve-favicon')
const session = require('express-session')
const bodyParser = require('body-parser');
const error_handler = require('./error_handler');
const port = process.env.PORT || config('app.port');

require('./bootstrap');

const app = express();

module.exports = function (injection) {
    app.set('views', path.join(__dirname, '../resources/', 'views'));
    app.set('view engine', 'pug');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(session({
        secret: config('app.secret_key'),
        saveUninitialized: true,
        resave: true,
        cookie: {
            maxAge: 259200000
        }
    }));

    app.use('/assets', express.static(__dirname + '/../assets'));
    app.use(favicon(__dirname + '/../assets/images/favicon.ico'));

    if(typeof injection === 'function')
        injection(app);

    require('../lib/hook')(app);
    require('../lib/middleware')(app);

    app.use('/api', require('../routes/api'));
    app.use('/', require('../routes/web'));

    app.use(function (error, req, res, next) {
        error_handler(error, req, res);
    });
    app.use(function(req, res, next) {
        error_handler(null, req, res);
    });

    app.listen(port, () => console.log(`Application listening on port ${port}!`));
};
