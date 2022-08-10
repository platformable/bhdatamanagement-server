
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventTypeControllers')

router.get("/",controller.getEventType)

module.exports = router




