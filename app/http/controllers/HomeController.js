const Controller = require('../../../lib/base/Controller');

class HomeController extends Controller {
    static get __dependencies() {
        return {
            constructor: ['app/services/HomeService'],
            index: ['ViewPageRequest']
        }
    }

    constructor(homeService) {
        super();
        this.homeService = homeService;
    }

    index(req, res) {
        let result = this.homeService.handle(req);
        res.json(result);
    }

    show(req, res) {
        res.end('ok');
    }
}

module.exports = HomeController;
