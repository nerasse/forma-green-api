const lib = require('./partnershipLib');
var router = require('express').Router();

router.get('/data',lib.data);
router.post('/ajout',lib.ajout);

module.exports = router;