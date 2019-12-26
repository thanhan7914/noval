const express = require('express');
const app = express();
const config = require('../lib/config');
const port = process.env.PORT || config('app.port');
const path = require('path');
const favicon = require('serve-favicon')
const session = require('express-session')
const bodyParser = require('body-parser');

module.exports = function() {
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

    require('../lib/hook')(app);
    require('../lib/middleware')(app);

    app.use('/assets', express.static(__dirname + '/../assets'));
    app.use(favicon(__dirname + '/../assets/images/favicon.ico'))
    app.use('/api', require('../routes/api'));
    app.use('/', require('../routes/web'));

    app.use(function(req, res) {
        res.render('errors/404');
    });

    app.listen(port, () => console.log(`app listening on port ${port}!`))
};
