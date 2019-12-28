const HttpError = require('../../lib/exceptions/HttpError');
const NotFoundHttpError = require('../../lib/exceptions/NotFoundHttpError');
const AccessDeniedHttpError = require('../../lib/exceptions/AccessDeniedHttpError');

class Handler {
    render(error, request, response) {
        response.status(error.statusCode ? error.statusCode : 404);

        console.log(error);
        switch(true)
        {
            case error instanceof AccessDeniedHttpError:
                return response.render('errors/403');
            case error instanceof NotFoundHttpError:
                return response.render('errors/404');
        }

        response.render('errors/404');
    }
}

module.exports = Handler;
