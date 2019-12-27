const express = require('express');
const app = express();
const config = require('../lib/config');
const path = require('path');
const favicon = require('serve-favicon')
const session = require('express-session')
const bodyParser = require('body-parser');

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

module.exports = app;
