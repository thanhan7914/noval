const Request = require('../../../lib/base/Request');

class ViewPageRequest extends Request {
    auth() {
        return false;
    }

    rules() {
        return {
            q: [
                'required',
                'string',
                'min:10',
                // /([0-9]+)/,
                'email2'
            ]
        };
    }
}

module.exports = ViewPageRequest;
