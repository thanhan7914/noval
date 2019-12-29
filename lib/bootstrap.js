module.exports = function(injection) {
    require('./index');
    require('./server')(injection);
};
