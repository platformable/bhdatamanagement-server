
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')

router.get("/",controller.getEvents)
router.get("/:id",controller.getEventById)
router.post("/",controller.createEvent)
router.put("/",controller.updateEvent)

module.exports = router




