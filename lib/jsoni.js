const utils = require('./utils');
const path = require('path');

let storage = [];

function load(root) {
    let files = utils.getFileList(path.join(__dirname, root), '.json');
    for(let file of files)
        storage.push({
            key: utils.relative(root, file).replace(/\//g, '.'),
            data: require(file + '.json')
        });

    return function (key) {
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
    };
}

module.exports = function (root) {
    return load(root);
};
