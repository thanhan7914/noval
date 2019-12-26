module.exports = function(app) {
    app.use(function(req, res, next) {
        require('./error_handle')(req);

        next();
    });
};
