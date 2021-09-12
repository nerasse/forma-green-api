const userLib = require('./userLib.js');
var router = require('express').Router();

router.get('/dev',userLib.dev);
router.post('/info',userLib.infoUser);

module.exports = router;