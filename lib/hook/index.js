module.exports = function(app) {
    app.use(function(req, res, next) {
        require('./validate_error_handle')(req);

        next();
    });
};
