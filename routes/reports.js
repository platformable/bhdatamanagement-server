const express = require('express')
const router= express.Router()
const controller= require("../controllers/reportsControllers")


router.get("/oef/fbo/participant_survey",controller.getOefFboParticipantEventsOutput)
router.get("/oef/cbt/participant_survey",controller.getOefCbtParticipantEventsOutput)
router.get("/oef/hiv/fbo_outreach",controller.getOefHivOutReach)
router.get("/oef/cbt/cbt_quarterly",controller.getOefCbtQuarterly)
router.get("/oef/ta/technical_assitance/",controller.getTechnicalAssistance)



module.exports = router
















