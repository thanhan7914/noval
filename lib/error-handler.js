const DIContainer = require('./index');
const NotFoundHttpError = require('./exceptions/not-found-http-error');

module.exports = function(error, req, res) {
    let handler = DIContainer.resolve('app/exceptions/handler');
    
    if(!error) error = new NotFoundHttpError();

    handler.render(error, req, res);
};
