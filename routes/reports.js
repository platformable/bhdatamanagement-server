const express = require('express')
const router= express.Router()
const controller= require("../controllers/reportsControllers")


router.get("/oef/fbo/participant_survey",controller.getOefFboParticipantEventsOutput)



module.exports = router

