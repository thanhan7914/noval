const Request = require('../../../lib/base/request');

class ViewPageRequest extends Request {
    auth() {
        return true;
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
