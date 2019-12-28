const MethodNotFoundError = require('../exceptions/MethodNotFoundError');
const ExpressRouter = require('express').Router;
const PureRequest = require('./Request');
const DIContainer = require('../index');
const root = 'app/';
const utils = require('../utils');

function prepareMiddleware(options, added = true) {
    let requestInstance = new PureRequest;
    let middleware = [];

    let isn;

    if(options.middleware instanceof Array)
    {
        for(let m of options.middleware)
        {
            isn = DIContainer.resolve(m);
            middleware.push(isn.handle.bind(isn));
        }
    }
    else if(typeof options.middleware === 'string')
    {
        isn = DIContainer.resolve(options.middleware);
        middleware.push(isn.handle.bind(isn));
    }

    if(options.validator instanceof Array)
    {
        for(let m of options.validator)
        {
            isn = DIContainer.resolve(m);
            middleware.push(isn.bindData.bind(isn));
        }
    }
    else if(typeof options.validator === 'string')
    {
        isn = DIContainer.resolve(options.validator);
        middleware.push(isn.bindData.bind(isn));
    }

    if(added)
    {
        if(!utils.hasattr(options, ['uses']))
            throw new MethodNotFoundError('missing callback');

        let args = options.uses.split('@');
        let instance = DIContainer.resolve(root + 'http/controllers/' + args[0]);
        if(typeof instance[args[1]] !== 'function')
            throw new MethodNotFoundError('callback must be a function');
    
        let parameters = DIContainer.resolveParameters(root + 'http/controllers/' + args[0],
                args[1], 'app/http/requests/');
    
        if(parameters.length > 0 && parameters[0] !== null)
            requestInstance = parameters[0];
    
        middleware.push(requestInstance.bindData.bind(requestInstance));
        middleware.push(function(req, res, next) {
            instance[args[1]](requestInstance, res, next);
        });    
    }

    return middleware;
}

function serve(router, method, pattern, callback) {
    let middleware;

    switch(typeof callback)
    {
        case 'function':
            {
                let pureRequest = new PureRequest;
                middleware = [];
                middleware.push(pureRequest.bindData.bind(pureRequest));
                middleware.push(function(req, res, next) {
                    callback(pureRequest, res, next);
                });
            }
            break;
        case 'string':
            {
                middleware = prepareMiddleware({
                    uses: callback
                });
            }
            break;
        case 'object':
            {
                middleware = prepareMiddleware(callback);
            }
            break;
        default:
            middleware = [];
            break;
    }

    router[method](pattern, ...middleware);
}

function createNovalRouter() {
    return new Proxy(new Router(), validator);
}

class Router {
    constructor() {
        this.router = ExpressRouter();
    }

    group(pattern, ...oths) {
        if(typeof pattern === 'string' || pattern instanceof RegExp)
        {
            if(oths.length <= 1 || typeof oths[1] !== 'function')
                throw new MethodNotFoundError('callback must be a function');

            let middleware = prepareMiddleware(oths[0], false);
            let novalRouter = createNovalRouter();
            this.router.use(pattern, novalRouter.ExpressRouter);
            novalRouter.use(middleware);
            oths[1](novalRouter);
        }
        else
            this.router.use(pattern, ...oths);
    }

    get(pattern, callback) {
        serve(this.router, 'get', pattern, callback);
    }

    post(pattern, callback) {
        serve(this.router, 'post', pattern, callback);
    }

    all(pattern, callback) {
        serve(this.router, 'all', pattern, callback);
    }

    put(pattern, callback) {
        serve(this.router, 'put', pattern, callback);
    }

    delete(pattern, callback) {
        serve(this.router, 'delete', pattern, callback);
    }

    get ExpressRouter() {
        return this.router;
    }
}

let validator = {
    get: function(obj, prop) {
        return prop in obj ?
            obj[prop] : obj.router[prop];
    }
};

module.exports = function() {
    return new Proxy(new Router(), validator);
};
