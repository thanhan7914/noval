const path = require('path');
const fs = require('fs');
const root = '../';
const DIContainer = require('./dicontainer')(root);

function relative(dir, file) {
    return path.relative(dir, file).replace(/\\/g, '/');
}

function getFileList(directoryPath) {
    let files = [];
    let result = fs.readdirSync(directoryPath);
    let tmp;

    for(let file of result)
    {
        tmp = path.join(directoryPath, file);
        if(fs.lstatSync(tmp).isDirectory())
            files = files.concat(getFileList(tmp));
        else
        {
            if(tmp.endsWith('.js'))
            {
                tmp = tmp.substring(0, tmp.length - 3);
                files.push(relative(__dirname, tmp));
            }
        }
    }

    return files;
}

function load() {
    let files = getFileList(path.join(__dirname, root, 'app'));
    DIContainer.resolveAndCreate(files.map(f => relative(root, f)).filter(f => f != 'app/index'));
    return DIContainer;
}

module.exports = load();
