const express = require('express');
const route = require('../lib/route')(express);

route.get('/', function(req, res) {
    res.render('index');
});

route.get('/test', 'HomeController@index');

module.exports = route.Router;
