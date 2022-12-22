
const express = require('express')
const router = express.Router()
const controller = require('../controllers/fbosControllers')

router.get("/",controller.getFbos)
router.post("/",controller.createFbo)
router.put("/",controller.updateFbo)

module.exports = router




