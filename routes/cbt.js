
const express = require('express')
const router = express.Router()
const controller = require('../controllers/cbtControllers')

router.get("/",controller.getAllCbts)
router.get("/:id",controller.getCbtById)
router.post("/create",controller.createCBTEvent)


module.exports = router
