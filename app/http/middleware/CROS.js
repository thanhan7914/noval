const Middleware = require('./Middleware');

class CROS extends Middleware {
    handle(req, res, next) {
        next();
    }
}

module.exports = CROS;
