const DIContainer = require('./bootstrap');
const NotFoundHttpError = require('./exceptions/NotFoundHttpError');

module.exports = function(error, req, res) {
    let handler = DIContainer.resolve('app/exceptions/Handler');
    
    if(!error) error = new NotFoundHttpError();

    handler.render(error, req, res);
};
