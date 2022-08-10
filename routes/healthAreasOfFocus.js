
const express = require('express')
const router = express.Router()
const controller = require('../controllers/healthAreasOfFocusControllers')

router.get("/",controller.gethealthAreasOfFocus)

module.exports = router




