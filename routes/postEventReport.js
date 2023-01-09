const express = require('express')
const router= express.Router()
const controller= require("../controllers/postEventReportControllers")


router.post("/create",controller.createPostEventReport)
router.get("/",controller.getAllPostEventReports)
router.get("/nys_events_output",controller.getNysEventsOutput)
router.get("/:id",controller.getPostEventReport)
router.get("/event/:id",controller.getPostEventReportById)
router.put("/update",controller.updatePostEventReport)
router.post("/oef/create",controller.createOEFPostEventReport)
router.get("/oef/event/:id",controller.getOefPostEventReportById)


module.exports = router