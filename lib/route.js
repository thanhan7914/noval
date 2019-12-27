const PureRequest = require('./base/Request');
const DIContainer = require('./bootstrap');
const root = 'app/';
const utils = require('./utils');

function serve(router, method, pattern, callback) {
    let middleware = [];
    let requestInstance = new PureRequest;

    switch(typeof callback)
    {
        case 'function':
            middleware.push(function(req, res, next) {
                callback(requestInstance, res, next);
            });
            break;
        case 'string':
            {
                let args = callback.split('@');
                let instance = DIContainer.resolve(root + 'http/controllers/' + args[0]);
                if(typeof instance[args[1]] !== 'function')
                    throw new Error('callback must be a function');

                let parameters = DIContainer.resolveParameters(root + 'http/controllers/' + args[0],
                     args[1], 'app/http/requests/');

                if(parameters.length > 0 && parameters[0] !== null)
                    requestInstance = parameters[0];

                middleware.push(requestInstance.bindData.bind(requestInstance));
                middleware.push(function(req, res, next) {
                    instance[args[1]](requestInstance, res, next);
                });
            }
            break;
        case 'object':
            {
                if(!utils.hasattr(callback, ['uses']))
                    throw Error('missing callback');
                
                let args = callback.uses.split('@');
                let instance = DIContainer.resolve(root + 'http/controllers/' + args[0]);
                if(typeof instance[args[1]] !== 'function')
                    throw new Error('callback must be a function');

                let parameters = DIContainer.resolveParameters(root + 'http/controllers/' + args[0],
                        args[1], 'app/http/requests/');

                if(parameters.length > 0 && parameters[0] !== null)
                    requestInstance = parameters[0];

                let isn;

                if(callback.middleware instanceof Array)
                {
                    for(let m of callback.middleware)
                    {
                        isn = DIContainer.resolve(m);
                        middleware.push(isn.handle.bind(isn));
                    }
                }
                else if(typeof callback.middleware === 'string')
                {
                    isn = DIContainer.resolve(callback.middleware);
                    middleware.push(isn.handle.bind(isn));
                }

                if(callback.validator instanceof Array)
                {
                    for(let m of callback.validator)
                    {
                        isn = DIContainer.resolve(m);
                        middleware.push(isn.bindData.bind(isn));
                    }
                }
                else if(typeof callback.validator === 'string')
                {
                    isn = DIContainer.resolve(callback.validator);
                    middleware.push(isn.bindData.bind(isn));
                }

                middleware.push(requestInstance.bindData.bind(requestInstance));
                middleware.push(function(req, res, next) {
                    instance[args[1]](requestInstance, res, next);
                });
            }
            break;
    }

    router[method](pattern, ...middleware);
}

class Route {
    constructor(express) {
        this.router = express.Router();
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

    get Router() {
        return this.router;
    }
}

let validator = {
    get: function(obj, prop) {
        return prop in obj ?
            obj[prop] : obj.router[prop];
    }
};

module.exports = function(express) {
    return new Proxy(new Route(express), validator);
};
