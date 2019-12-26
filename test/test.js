const root = 'app/';

const DIContainer = require('../lib/bootstrap');
const PureRequest = require('../lib/request');

console.log(DIContainer);
let h = DIContainer.resolve('app/http/controllers/HomeController');
console.log(h instanceof PureRequest);
