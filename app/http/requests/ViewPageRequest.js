const Request = require('../../../lib/request');

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
                /([0-9]+)/
            ]
        };
    }
}

module.exports = ViewPageRequest;
