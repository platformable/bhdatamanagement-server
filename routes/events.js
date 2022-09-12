
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')

router.get("/",controller.getEvents)
router.get("/:id",controller.getEventById)
router.post("/",controller.createEvent)
router.post("/createeventtest",controller.createeventtest)
router.put("/",controller.updateEvent)
router.delete("/delete",controller.deleteEvent)

module.exports = router




