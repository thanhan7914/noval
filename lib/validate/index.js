const _ = require('lodash');
const func = require('./fn');
const root_validate = 'app/validator';

const external_validator = require('../../app/validator/config.json').all;

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
    else if(_.isString(pattern))
    {
        if(_.isFunction(func[pattern]) && !(result = func[pattern](value)).passed)
            return result;

        let args = _.split(pattern, ':');
        let fname = args[0];
        args[0] = value;

        if(args.length > 1)
        {
            if(_.isFunction(func[fname]) && !(result = func[fname].apply(null, args)).passed)
                return result;
        }

        for(let val of external_validator)
            if(val.name === fname)
            {
                let DIContainer = require('../bootstrap');
                let instance = DIContainer.resolve(val.validator);
                result = instance.handle(...args);
                break;
            }

        if(!result.passed)
            return result;
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
