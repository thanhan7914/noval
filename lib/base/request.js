const _ = require('lodash');
const validate = require('../validate');
const utils = require('../utils');
const AccessDeniedHttpError = require('../exceptions/access-denied-http-error');
const ValidationError = require('../exceptions/validation-error');

class Request {
    bindData(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.fields = _.mapValues(_.merge({}, req.query, _.isUndefined(req.body) ? {} : req.body,
            _.isUndefined(req.fields) ? {} : req.fields, _.isUndefined(req.files) ? {} : req.files), function(v) {
            return utils.parse(v);
        });

        if(!this.auth())
        {
            next(new AccessDeniedHttpError())
            return;
        }

        let result_valid = validate(this, this.rules(), this.messages());
        let pass = result_valid.map(r => r.validate.passed).filter(b => !b);

        if(pass.length > 0)
        {
            if(req.originalUrl.startsWith('/api/'))
            {
                next(new ValidationError());
                return;
            }

            req.session.errors = result_valid;
            req.session.inputData = this.fields;
            res.goBack();
            return;
        }

        next();
    }

    auth() {
        return true;
    }

    rules() {
        return {};
    }

    messages() {
        return {};
    }

    get HttpRequest() {
        return this.req;
    }

    get(field) {
        if(_.isUndefined(this.fields[field]))
            return null;
        
        return this.fields[field];
    }

    all() {
        return this.fields;
    }

    only(fields) {
        let data = {};

        for(let i of fields)
        {
            data[i] = this.get(i);
        }

        return data;
    }
}

module.exports = Request;
