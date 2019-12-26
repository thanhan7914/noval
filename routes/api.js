const express = require('express');
const route = require('../lib/route')(express);
const middleware = require('../lib/middleware');

middleware(route, 'api');

route.get('/', function(req, res) {
    res.json({status: 200});
});

module.exports = route.Router;
