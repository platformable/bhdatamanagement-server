const express = require('express')
const router= express.Router()
const controller= require("../controllers/participantEventOutputsControllers")


router.post("/create",controller.createParticipantEventOutputs)
router.get("/",controller.getParticipantEventOutputs)
router.get("/:id",controller.getParticipantEventOutputsById)




module.exports = router