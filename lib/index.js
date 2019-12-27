const config = require('./config');
const port = process.env.PORT || config('app.port');

require('./bootstrap');
const app = require('../app');

require('../lib/hook')(app);
require('../lib/middleware')(app);

app.use('/api', require('../routes/api'));
app.use('/', require('../routes/web'));

app.use(function(error, req, res, next) {
    console.log(error);
    
    res.render('errors/404');
});

app.listen(port, () => console.log(`app listening on port ${port}!`))
