const compte = require('./benevoleLib.js');

module.exports = function (app) {
    app.post('/login',compte.login);
    app.post('/register',compte.register);
    app.post('/benevoleModif',compte.benevoleModif);
    app.post('/memberModif',compte.memberModif);
    app.post('/info',compte.info);
}
