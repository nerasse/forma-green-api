const userLib = require('./userLib.js');
var router = require('express').Router();

router.get('/dev',userLib.dev);

module.exports = router;