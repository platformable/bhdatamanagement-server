
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')

router.get("/",controller.getEvents)
router.post("/",controller.createEvent)

module.exports = router




