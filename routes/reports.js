const express = require('express')
const router= express.Router()
const controller= require("../controllers/reportsControllers")


router.get("/oef/fbo/participant_survey",controller.getOefFboParticipantEventsOutput)
router.get("/oef/cbt/participant_survey",controller.getOefCbtParticipantEventsOutput)
router.get("/oef/hiv/fbo_outreach",controller.getOefHivOutReach)
router.get("/oef/cbt/cbt_quarterly",controller.getOefCbtQuarterly)
router.get("/oef/ta/technical_assitance/",controller.getTechnicalAssistance)
router.get("/oef/cbt/facilitator/",controller.getOefCbtFacilitartor)
router.get("/oef/sv/site_visits/",controller.getOefSiteVisits)

router.get("/oef/events_output/report/",controller.getOefEventsOutputReport)
router.get("/oef/participant_events_output/report/",controller.getOefParticipantEventsOutput)
router.get("/oef/cab/organizer", controller.getOefCabOrganizer)





module.exports = router
















