const express = require('express')
const router= express.Router()
const controller= require("../controllers/postEventReportControllers")


router.post("/create",controller.createPostEventReport)

module.exports = router