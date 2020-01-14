const _ = require('lodash');
const func = require('./fn');
const root_validate = 'app/validator';
const messages = require('./messages.json');

const external_validator = require('../../app/validator/config.json').all;

function validate(value, pattern, req) {
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
                let DIContainer = require('../index');
                let instance = DIContainer.resolve(val.validator);
                instance.get = req.get.bind(req);
                result = instance.validate(...args);
                break;
            }

        if(result && !result.passed)
            return result;
    }

    return {
        passed: true,
        message: 'success'
    };
};

function singleValidate(value, rules, req) {
    if(!_.isArray(rules))
        rules = rules.split('|');

    let result;

    if(rules.indexOf('nullable') !== -1 && (_.isNil(value) || 
         (_.isString(value) && _.isEmpty(value))))
        return {
            passed: true,
            message: 'success'
        };

    for(let pattern of rules)
        if(!(result = validate(value, pattern, req)).passed)
            return _.merge({
                rule: pattern instanceof RegExp ? 'regexp' : pattern
            }, result);

    return {
        passed: true,
        message: 'success'
    };
}

function getMessage(name) {
    if(_.has(messages, name))
        return messages[name];
    
    return name;
}

module.exports = function(req, rules, custom_messages) {
    let keys = _.keys(rules);
    let result = [];
    let validate;

    for(let key of keys)
    {
        validate = singleValidate(req.get(key), rules[key], req);

        if(!validate.passed)
        {
            if(_.has(custom_messages, key) && _.has(custom_messages[key], validate.rule))
                validate.message = custom_messages[key][validate.rule];
            else
                validate.message = getMessage(validate.rule);
        }

        result.push({
            key,
            validate: validate
        });
    }

    return result;
};
