const DIContainer = require('./bootstrap');
const root_middleware = 'app/http/middleware';
const path = require('path');
const fs = require('fs');
const { join } = require('./utils');
const _ = require('lodash');

let config = {};

module.exports = function (app) {
    let fullpath = path.join(__dirname, '../', root_middleware, 'config.json');

    if(fs.existsSync(fullpath))
    {
        config = require(fullpath);

        if(typeof config.all !== 'undefined' && config.all instanceof Array)
            for(let name of config.all)
                app.use(function (req, res, next) {
                    if(!name.startsWith(root_middleware))
                        name = join(root_middleware, name);

                    DIContainer.resolve(name).handle(req, res, next);
                });
    }
    else
    {
        let modules = _.keys(DIContainer.modules).filter(m => m.startsWith(root_middleware));

        for(let m of modules)
        {
            app.use(function (req, res, next) {
                DIContainer.resolve(m).handle(req, res, next);
            });
        }
    }
};
