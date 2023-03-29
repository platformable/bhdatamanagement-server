const express = require('express')
const router= express.Router()
const controller= require("../controllers/participantEventOutputsControllers")


router.post("/create",controller.createParticipantEventOutputs)
router.post("/oef/participant-event-survey/create",controller.createOefParticipantEventOutputs)
router.post("/oef/cbt/participant-event-survey/create",controller.createOefCbtParticipantEventOutputs)
router.post("/oef-cbt-quarterly-evaluation-survey/create",controller.createOefCbtQuarterlyEvaluationSurvey)
router.post("/oef-pre-workout-survey/create",controller.createOefPreWorkshopSurvey)
router.post("/oef-yip-participant-session1-survey/create",controller.createOefYipParticipantSession1)
router.post("/oef-yip-participant-session2-survey/create",controller.createOefYipParticipantSession2)
router.post("/oef-yip-participant-session3-survey/create",controller.createOefYipParticipantSession3)
router.get("/",controller.getParticipantEventOutputs)
router.get("/:id",controller.getParticipantEventOutputsById)
router.get("/oef/cbt",controller.getParticipantOEFCBTEventOutputs)




module.exports = router





