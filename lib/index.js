const error_handler = require('./error_handler');
const config = require('./config');
const port = process.env.PORT || config('app.port');

require('./bootstrap');
const app = require('../app');

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

app.listen(port, () => console.log(`app listening on port ${port}!`))
