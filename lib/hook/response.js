const _ = require('lodash');
const utils = require('../utils');
const lang = require('../lang');
const config = require('../config');
let nativeRender;

function prepareData(req) {
    let errors = _.isUndefined(req.errors) ? [] : req.errors;

    return {
        config: config,
        trans: lang.trans,
        request: {
            error: function(name) {
                if(!(errors instanceof Array)) return null;
    
                for(let e of errors)
                    if(e.key === name)
                        return e.validate.message;
    
                return null;
            },
            errors: errors,
            old: function(name) {
                console.log(req.old);
                
                if(_.isFunction(req.old))
                    return req.old(name);
                return null;
            },
            get: req.getInput
        }
    };
}

module.exports = function(req, res) {
    res.goBack = function() {
        let backURL = req.header('Referer') || '/';
        res.redirect(backURL);
    };
    
    nativeRender = res.render.bind(res);

    res.render = function(...oths) {
        let rData = prepareData(req);

        if(oths.length === 1)
        {
            oths.push(rData)
            return nativeRender.apply(res, oths);
        }

        oths[1] = utils.inherit(oths[1], rData)
        nativeRender.apply(res, oths);
    }
};
