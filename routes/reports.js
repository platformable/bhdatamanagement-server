const express = require('express')
const router= express.Router()
const controller= require("../controllers/reportsControllers")


router.get("/oef/fbo/participant_survey/:startDate&:endDate",controller.getOefFboParticipantEventsOutput)
router.get("/oef/cbt/participant_survey/:startDate&:endDate",controller.getOefCbtParticipantEventsOutput)
router.get("/oef/hiv/fbo_outreach/:startDate&:endDate",controller.getOefHivOutReach)
router.get("/oef/cbt/cbt_quarterly/:startDate&:endDate",controller.getOefCbtQuarterly)
router.get("/oef/ta/technical_assitance/:startDate&:endDate",controller.getTechnicalAssistance)
router.get("/oef/cbt/facilitator/:startDate&:endDate",controller.getOefCbtFacilitartor)
router.get("/oef/sv/site_visits/:startDate&:endDate",controller.getOefSiteVisits)
router.get("/oef/events_output/report/:startDate&:endDate",controller.getOefEventsOutputReport)
router.get("/oef/participant_events_output/report/:startDate&:endDate",controller.getOefParticipantEventsOutput)
router.get("/oef/cab/organizer/:startDate&:endDate", controller.getOefCabOrganizer)





module.exports = router
















