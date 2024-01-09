
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventsControllers')
const printController = require('../controllers/eventsPrintControllers')

router.get("/",controller.getEvents)
router.get("/nys/report/getEvents",controller.getEventsNYSCMPReport)
router.get("/:id",controller.getEventById)
router.get("/oef/cab",controller.getOefCabEvents)
router.get("/oef/hiv/data_to_print/:id",printController.getHivOutreachDataToPrint)
router.get("/oef/cab/data_to_print/:id",printController.getCabDataToPrint)
router.post("/",controller.createEvent)
router.post("/nyscreate",controller.createNYSEvent)
router.post("/oef/create",controller.createOefEvent)
router.post("/oef/cbt/create",controller.createOefCbtEvent)
router.post("/oef/cab/create",controller.createOefCabEvent)
router.post("/oef/yip/create",controller.createOefYipEvent)
router.put("/oef/update",controller.updateOefEvent)
router.put("/oef/cbt/update",controller.updateOefCbtEvent)
router.put("/oef/cab/update",controller.updateOefCabEvent)
router.put("/oef/yip/update",controller.updateOefYipEvent)
router.put("/oef/update_from_event_output",controller.updateOefEventFromEventsOuput)
router.put("/",controller.updateEvent)
router.delete("/delete",controller.deleteEvent)

router.get("/dropbox",controller.getDropbox)

module.exports = router




