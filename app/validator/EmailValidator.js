const Request = require('../../lib/request');
const Validator = require('../../lib/validate/validator');

class EmailValidator {
    handle(value) {
        return true;
    }
}

module.exports = EmailValidator;
