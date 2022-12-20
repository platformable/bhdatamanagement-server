
const express = require('express')
const router = express.Router()
const controller = require('../controllers/fbosControllers')

router.get("/",controller.getFbos)

module.exports = router




