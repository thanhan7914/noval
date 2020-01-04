const router = require('../lib/base/router')();
const middleware = require('../lib/middleware');

middleware(router, 'web');

router.use(function(req, res, next) {
    req.transport({haha: 'ok'});
    next();
});

router.get('/', function(req, res) {
    // if(req.errors) return res.json(req.errors);
    res.render('index');
    // res.json(require('lodash').merge({}, req.all(), {csrf: req.csrfToken()}));
});

router.get('/test-validator', {
    validator: ['app/http/requests/ViewPageRequest']
}, function(req, res) {
    res.json(req.all());
});

router.post('/', {
    validator: {
        q: [
            'nullable',
            'string',
            'min:2'
        ],
        t: 'required|string|min:1'
    }
}, function(req, res) {
    res.json(req.all());
});

router.get('/show', {
    middleware: [],
    validator: ['app/http/requests/CreatePageRequest'],
    uses: 'HomeController@show'
});

router.get('/test', 'HomeController@index');

router.group('/aa', {
    middleware: [],
    validator: ['app/http/requests/ViewPageRequest']
}, function(router) {
    router.get('/', 'HomeController@show');
});

module.exports = router.ExpressRouter;
