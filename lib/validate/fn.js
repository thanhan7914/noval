const _ = require('lodash');

function response(passed, message = 'invalid') {
    return {
        passed,
        message
    };
}

module.exports = {
    'required': function (value) {
        return response(!_.isNull(value) && !_.isUndefined(value));
    },
    'nullable': function (value) {
        return response(true);
    },
    'string': function (value) {
        return response(_.isString(value) || _.isNumber(value));
    },
    'number': function (value) {
        return response(_.isNumber(value));
    },
    'array': function (value) {
        return response(_.isArray(value));
    },
    'max': function (value, len) {
        if(_.isNumber(value)) return response(value.toString().length <= len);
        return response(value.length <= len);
    },
    'min': function (value, len) {
        if(_.isNumber(value)) return response(value.toString().length >= len);
        return response(value.length >= len);
    },
    'email': function (value) {
        return response(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value));
    }
};
