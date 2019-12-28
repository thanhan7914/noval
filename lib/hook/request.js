const _ = require('lodash');
const utils = require('../utils');
let fields;

module.exports = function(req) {
    if(!_.isUndefined(req.session.errors))
    {
        req.errors = req.session.errors;
        delete req.session.errors;
    }

    if(!_.isUndefined(req.session.inputData))
    {
        req.oldInputData = req.session.inputData;
        req.old = function(name) {
            if(_.isUndefined(req.oldInputData[name]))
                return null;
            return req.oldInputData[name];
        };

        delete req.session.inputData;
    }

    fields = _.mapValues(_.merge({}, req.query, req.body), function(v) {
        return utils.parse(v);
    });

    req.getInput = function(name) {
        if(_.isUndefined(fields[name]))
            return null;

        return fields[name];
    }
};
