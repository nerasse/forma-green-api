const lib = require('./benevoleLib.js');
var router = require('express').Router();

router.post('/login',lib.login);
router.post('/register',lib.register);
router.post('/benevoleModif',lib.benevoleModif);
router.post('/memberModif',lib.memberModif);
router.post('/deleteBenevole',lib.deleteBenevole);
router.post('/info',lib.info);

module.exports = router;