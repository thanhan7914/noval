const Request = require('../../../lib/base/request');

class CreatePageRequest extends Request {
    auth() {
        return false;
    }

    rules() {
        return {
        };
    }
}

module.exports = CreatePageRequest;
