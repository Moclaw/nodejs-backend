const express = require('express');
const router = express.Router();
const Joi = require('joi');

//routes

router.post('/getip', getip);

module.exports = router;


function getip(req, res, next) {
	var ip = (req.headers['x-forwarded-for'] || '').split(',').pop().trim() ||
		req.socket.remoteAddress
	console.log(ip);
}