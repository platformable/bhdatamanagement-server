
const express = require('express')
const router = express.Router()
const controller = require('../controllers/technicalAssistanceControllers')

router.get("/",controller.getAllTechnicalAssitance)
router.get("/:id",controller.getTechnicalAssitanceById)
router.post("/create",controller.createTechnicallAssistance)
router.put("/update",controller.updateTechnicalAssistance)


module.exports = router