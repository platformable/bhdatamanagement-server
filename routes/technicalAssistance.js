
const express = require('express')
const router = express.Router()
const controller = require('../controllers/technicalAssistanceControllers')

router.get("/",controller.getAllTechnicalAssitance)
router.post("/create",controller.createTechnicallAssistance)


module.exports = router