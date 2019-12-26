const path = require('path');
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
    }
};
