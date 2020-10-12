var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
const results = await pgClient.query('SELECT * from values');
		res.send(JSON.stringify(results));
});

module.exports = router;
