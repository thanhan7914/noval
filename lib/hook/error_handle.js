const _ = require('lodash');

module.exports = function(req) {
    if(!_.isUndefined(req.session.errors))
    {
        req.errors = req.session.errors;
        delete req.session.errors;
    }
};
