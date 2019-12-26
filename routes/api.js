const express = require('express');
const route = require('../lib/route')(express);

route.get('/', function(req, res) {
    res.json({status: 200});
});

module.exports = route.Router;
