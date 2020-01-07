const utils = require('./utils');
const path = require('path');

function loadJsConfig(root) {
    let storage = [];
    let files = utils.getFileList(path.join(__dirname, root), '.js');

    for(let file of files)
        storage.push({
            key: utils.relative(root, file).replace(/\//g, '.'),
            data: require(file)
        });

    return {
        get: function (key) {
            let pos = key.lastIndexOf('.');
            let file = key;
            if(pos !== -1)
            {
                file = key.substring(0, pos);
                key = key.substring(pos + 1);
            }
        
            for(let c of storage)
                if(c.key == file)
                    return c.data[key];
        
            return null;
        },
        has: function(key) {
            let pos = key.lastIndexOf('.');
            let file = key;
            if(pos !== -1)
            {
                file = key.substring(0, pos);
                key = key.substring(pos + 1);
            }

            for(let c of storage)
                if(c.key == file)
                    return (key in c.data);

            return false;
        }
    };
}

let jsConfig = loadJsConfig('../config');
let jsonConfig = require('./jsoni')('../config');

module.exports = function(key) {
    if(jsConfig.has(key))
        return jsConfig.get(key);

    return jsonConfig(key);
}
