const compte = require('./user/userLib.js');

module.exports = function (app) {
    app.get('/test',compte.test);
}
