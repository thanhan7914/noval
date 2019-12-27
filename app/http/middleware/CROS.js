const Middleware = require('../../../lib/base/Middleware');

class CROS extends Middleware {
    handle(req, res, next) {
        next();
    }
}

module.exports = CROS;
