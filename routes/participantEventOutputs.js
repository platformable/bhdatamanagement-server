const express = require('express')
const router= express.Router()
const controller= require("../controllers/participantEventOutputsControllers")


router.post("/create",controller.createParticipantEventOutputs)
router.post("/oef/participant-event-survey/create",controller.createOefParticipantEventOutputs)
router.post("/oef/cbt/participant-event-survey/create",controller.createOefCbtParticipantEventOutputs)
router.post("/oef-cbt-quarterly-evaluation-survey/create",controller.createOefCbtQuarterlyEvaluationSurvey)
router.get("/",controller.getParticipantEventOutputs)
router.get("/:id",controller.getParticipantEventOutputsById)
router.get("/oef/participant_events_outputs",controller.getParticipantOEFEventOutputs)




module.exports = router