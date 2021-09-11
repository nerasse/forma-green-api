const lib = require('./memberLib.js');
var router = require('express').Router();

router.post('/login', lib.login);
router.post('/register', lib.register);

module.exports = router;