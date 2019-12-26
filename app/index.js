const express = require('express')
const app = express()
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');

module.exports = function() {
    app.set('views', path.join(__dirname, '../resources/', 'views'));
    app.set('view engine', 'pug');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use('/assets', express.static(__dirname + '/assets'));

    require('../lib/middleware')(app);

    app.use('/api', require('../routes/api'));
    app.use('/', require('../routes/web'));
    app.listen(port, () => console.log(`app listening on port ${port}!`))
};
