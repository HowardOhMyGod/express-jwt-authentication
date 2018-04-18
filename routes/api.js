var express = require('express');
var router = express.Router();

var jwtVerify = require('../middleware/jwt');

router.use(jwtVerify);

router.get('/', (req, res) => {
    res.status(200).send({
        api: 'Now you can use my api:)'
    })
});

module.exports = router;
