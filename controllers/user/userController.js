const userLib = require('./userLib.js');

module.exports = function (app) {
    app.post('/login',userLib.login);
    app.post('/register',userLib.register);
    app.post('/info',userLib.infoUser);
}
