const PureRequest = require('../lib/request');

const root = 'app/';

const DIContainer = require('../lib/bootstrap');
console.log(DIContainer);
let h = DIContainer.resolve('app/http/controllers/HomeController');
console.log(h.index);
