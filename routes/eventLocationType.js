
const express = require('express')
const router = express.Router()
const controller = require('../controllers/eventLocationTypeControllers')

router.get("/",controller.getEventLocationType)

module.exports = router




