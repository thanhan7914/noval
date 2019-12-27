const _ = require('lodash');
const validate = require('../validate');
const utils = require('../utils');

class Request {
    bindData(req, res, next) {
        this.req = req;
        this.res = res;
        this.next = next;
        this.fields = _.mapValues(_.merge({}, this.req.query, this.req.body), function(v) {
            return utils.parse(v);
        });

        if(!this.auth())
        {
            this.res.sendStatus(403);
            this.res.render('errors/403');
            return;
        }

        let result_valid = validate(this, this.rules());
        let pass = result_valid.map(r => r.validate.passed).filter(b => !b);

        if(pass.length > 0)
        {
            req.session.errors = result_valid;
            let backURL = req.header('Referer') || '/';
            this.res.redirect(backURL);
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
