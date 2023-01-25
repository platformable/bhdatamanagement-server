
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')

router.get("/",controller.getEvents)
router.get("/:id",controller.getEventById)
router.get("/oef/cab",controller.getOefCabEvents)
router.post("/",controller.createEvent)
router.post("/createeventtest",controller.createeventtest)
router.post("/oef/create",controller.createOefEvent)
router.post("/oef/cbt/create",controller.createOefCbtEvent)
router.post("/oef/cab/create",controller.createOefCabEvent)
router.put("/oef/update",controller.updateOefEvent)
router.put("/oef/cbt/update",controller.updateOefCbtEvent)
router.put("/oef/cab/update",controller.updateOefCabEvent)
router.put("/oef/update_from_event_output",controller.updateOefEventFromEventsOuput)
router.put("/",controller.updateEvent)
router.delete("/delete",controller.deleteEvent)

router.get("/dropbox",controller.getDropbox)

module.exports = router




