const path = require('path');
const root = '../';
const DIContainer = require('./dicontainer');
const ignore = require('./config')('app.bsignore');
const utils = require('./utils');
let instance = new DIContainer(root);
let files = utils.getFileList(path.join(__dirname, root, 'app'));

instance.resolveAndCreate(files.map(f => utils.relative(root, f)).filter(f => ignore.indexOf(f) === -1));

module.exports = instance;
