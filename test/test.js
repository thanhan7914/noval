const root = 'app/';

const DIContainer = require('../lib/bootstrap');
const PureRequest = require('../lib/request');

console.log(DIContainer);
let h = DIContainer.resolve('app/http/controllers/HomeController');
console.log(h instanceof PureRequest);

console.log(require('../lib/config')('app.port'))

const { trans, getLocale } = require('../lib/lang');
console.log(trans('error.message'));
console.log(getLocale())
