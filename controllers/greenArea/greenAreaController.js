const lib = require('./greenAreaLib.js');
var router = require('express').Router();

router.get('/data',lib.data);
router.post('/ajout',lib.ajout);

module.exports = router;