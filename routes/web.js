const express = require('express');
const route = require('../lib/route')(express);
const middleware = require('../lib/middleware');

middleware(route, 'web');

route.get('/', function(req, res) {
    if(req.errors) return res.json(req.errors);
    res.render('index');
});

route.get('/show', {
    middleware: ['app/http/middleware/CROS'],
    validator: ['app/http/requests/ViewPageRequest'],
    uses: 'HomeController@show'
});

route.get('/test', 'HomeController@index');

module.exports = route.Router;
