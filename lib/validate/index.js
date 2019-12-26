const _ = require('lodash');
const func = require('./fn');
const DIContainer = require('../bootstrap');
const root_validate = 'app/validate';

const external_validate = _.keys(DIContainer.modules).filter(m => m.startsWith(root_validate));

function validate(value, pattern) {
    let result;

    if(pattern instanceof RegExp)
    {
        if(!pattern.test(value))
        {
            return {
                passed: false,
                message: 'invalid'
            };
        }
    }
    else
    {
        if(_.isFunction(func[pattern]) && !(result = func[pattern](value)).passed)
            return result;

        let args = _.split(pattern, ':');
        if(args.length > 1)
        {
            let fname = args[0];
            args[0] = value;

            if(_.isFunction(func[fname]) && !(result = func[fname].apply(null, args)).passed)
                return result;
        }
    }

    return {
        passed: true,
        message: 'success'
    };
};

function singleValidate(value, rules) {
    let result;

    for(let pattern of rules)
        if(!(result = validate(value, pattern)).passed)
            return result;

    return {
        passed: true,
        message: 'success'
    };
}

module.exports = function(req, rules) {
    let keys = _.keys(rules);
    let result = [];

    for(let key of keys)
    {
        result.push({
            key,
            validate: singleValidate(req.get(key), rules[key])
        });
    }

    return result;
};
