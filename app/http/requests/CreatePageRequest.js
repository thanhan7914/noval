const Request = require('../../../lib/base/Request');

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
