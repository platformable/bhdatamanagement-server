
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')

router.get("/",controller.getEvents)
router.get("/:id",controller.getEventById)
router.post("/",controller.createEvent)
router.post("/createeventtest",controller.createeventtest)
router.post("/oef/create",controller.createOefEvent)
router.put("/",controller.updateEvent)
router.delete("/delete",controller.deleteEvent)

router.get("/dropbox",controller.getDropbox)

module.exports = router




