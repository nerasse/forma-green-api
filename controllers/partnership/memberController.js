const compte = require('./lib.js');

module.exports = function (app) {
    app.post('/login',compte.login);
    app.post('/register',compte.register);
    app.post('/info',compte.infoUser);
}
