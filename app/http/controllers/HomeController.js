class HomeController {
    static get __dependencies() {
        return {
            constructor: ['app/services/HomeService'],
            index: ['ViewPageRequest']
        }
    }

    constructor(homeService) {
        this.homeService = homeService;
    }

    index(req, res) {
        let result = this.homeService.handle(req);
        res.json(result);
    }
}

module.exports = HomeController;
