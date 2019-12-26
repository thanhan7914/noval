const path = require('path');
const fs = require('fs');
const _ = require('lodash');

module.exports = {
    defaultValue: function(type) {
        switch(type) {
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            default: return null;
        }
    },
    orDefault: function(value, d = this.defaultValue(value)) {
        return (typeof value == 'undefined' ? d : value);
    },
    parse: function(value) {
        try {
            if(/(^(0+)[0-9]+)/.test(value)) return value;
            return JSON.parse(value);
        }
        catch {return value;}
    },
    join: function (dir, file) {
        return path.join(dir, file).replace(/\\/g, '/');
    },
    relative: function (dir, file) {
        return path.relative(dir, file).replace(/\\/g, '/');
    },
    getFileList: function(directoryPath, ext = '.js') {
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
                if(tmp.endsWith(ext))
                {
                    tmp = tmp.substring(0, tmp.length - ext.length);
                    files.push(this.relative(__dirname, tmp));
                }
            }
        }
    
        return files;
    }
};
