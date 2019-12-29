module.exports = function(injection) {
    console.log(
     require('./index'));
    require('./server')(injection);
};
