const express = require('express');
const route = require('../lib/route')(express);
const middleware = require('../lib/middleware');

middleware(route.Router, 'web');

route.get('/', function(req, res) {
    if(req.session.errors) return res.json(req.session.errors)
    res.render('index');
});

route.get('/test', 'HomeController@index');

module.exports = route.Router;
