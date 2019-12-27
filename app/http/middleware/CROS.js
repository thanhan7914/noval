const Middleware = require('../../../lib/base/middleware');

class CROS extends Middleware {
    handle(req, res, next) {
        next();
    }
}

module.exports = CROS;
