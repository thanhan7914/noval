const router = require('../lib/base/Router')();
const middleware = require('../lib/middleware');

middleware(router, 'web');

router.all('/', function(req, res) {
    // if(req.errors) return res.json(req.errors);
    // res.render('index');
    res.json(req.all());
});

router.get('/show', {
    middleware: ['app/http/middleware/CROS'],
    validator: ['app/http/requests/CreatePageRequest'],
    uses: 'HomeController@show'
});

router.get('/test', 'HomeController@index');

router.group('/aa', {
    middleware: ['app/http/middleware/CROS'],
    validator: ['app/http/requests/ViewPageRequest']
}, function(router) {
    router.get('/', 'HomeController@show');
});

module.exports = router.ExpressRouter;
