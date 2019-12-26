// class A {
//     static get __dependencies() {
//         return {
//              constructor: ['./a', './b']
//         };
//     }
// }
const path = require('path');
const utils = require('./utils');

function join(dir, file) {
    return path.join(dir, file).replace(/\\/g, '/');
}

class DIContainer {
    constructor(root) {
        this.root = root;
        this.modules = {};
    }

    require(type) {
        return require(path.join(this.root, type));
    }

    get(type) {
        if(this.modules.hasOwnProperty(type))
            return this.modules[type];
        return null;
    }

    resolve(name) {
        let m = null;

        if(typeof name === 'string' && this.modules.hasOwnProperty(name))
            m = this.modules[name];
        else {
            for(let type in this.modules)
                if(this.modules[type].constructor === name)
                {
                    m = this.modules[type];
                    break;
                }
        }

        if(m == null) return null;

        if(typeof m.constructor !== 'function')
            return m.constructor;

        let deps_instance = [];
        for(let d of m.dependencies)
            deps_instance.push(this.resolve(d));

        return new m.constructor(...deps_instance);
    }

    store(type, value) {
        if(this.modules.hasOwnProperty(type)) return type;

        let deps = [];

        if(typeof value.__dependencies == 'object' && 
             typeof value.__dependencies.constructor == 'object' &&
             value.__dependencies.constructor instanceof Array)
        {
            for(let d of value.__dependencies.constructor)
            {
                if(typeof d == 'string')
                    deps.push(this.store(d, this.require(d)));
                else if(typeof d == 'object')
                    deps.push(this.store(d.type, utils.orDefault(d.module, utils.defaultValue(d.type))));
            }
        }

        this.modules[type] = {
            constructor: value,
            dependencies: deps
        };

        return type;
    }

    resolveAndCreate(modules) {
        //modules => {type, module}
        for(let m of modules)
        {
            if(typeof m == 'string')
                this.store(m, this.require(m));
            else
                this.store(m.type, m.module);
        }
    }

    resolveParameters(type, fname, dir = '') {
        let m = this.get(type).constructor;
        
        if(m === null)
            return [];
    
        if(typeof m.__dependencies === 'undefined' ||
            typeof m.__dependencies[fname] === 'undefined')
            return [];
        
        return m.__dependencies[fname].map(d => {
            if(typeof d === 'string')
            {
                if(!d.startsWith(dir)) d = join(dir, d);
                return this.resolve(d);
            }

            return this.resolve(d);
        });
    }    
}

module.exports = function(root = '') {
    return new DIContainer(root);
};
