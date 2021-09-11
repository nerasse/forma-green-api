const lib = require('./formingStructureLib.js');
var router = require('express').Router();

router.post('/login',lib.login);
router.post('/register',lib.register);
router.post('/info',lib.infoUser);


module.exports = router;