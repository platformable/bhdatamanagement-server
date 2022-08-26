const express = require('express')
const router= express.Router()
const controller= require("../controllers/postEventReportControllers")


router.post("/create",controller.createPostEventReport)
router.get("/",controller.getAllPostEventReports)

module.exports = router