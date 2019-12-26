const PureRequest = require('./request');
const DIContainer = require('./bootstrap');
const root = 'app/';

function serve(router, method, pattern, callback) {
    switch(typeof callback)
    {
        case 'function':
            router[method](pattern, callback);
            break;
        case 'string':
            let args = callback.split('@');
            let instance = DIContainer.resolve(root + 'http/controllers/' + args[0]);

            if(typeof instance[args[1]] == 'function')
                router[method](pattern, function(req, res, next) {
                    let parameters = DIContainer.resolveParameters(root + 'http/controllers/' + args[0], args[1], 'app/http/requests/');
                    let requestInstance;

                    if(parameters.length > 0 && parameters[0] !== null)
                        requestInstance = parameters[0];
                    else requestInstance = new PureRequest;

                    if(requestInstance.bindData(req, res, next))
                        instance[args[1]](requestInstance, res, next);
                });
            break;
    }
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
