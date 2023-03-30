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
router.post("/oef/cbt/create",controller.createOEFCbtPostEventReport)
router.post("/oef/cab/create",controller.createOEFCabPostEventReport)
router.post("/oef/yip/create",controller.createOEFYipPostEventReport)
router.get("/oef/event/:id",controller.getOefPostEventReportById)
router.get("/oef/cbt/event/:id",controller.getOefCbtPostEventReportById)
router.put("/oef/event/update",controller.updateOefPostEventReport)
router.put("/oef/cbt/event/update",controller.updateOefCbtPostEventReport)
router.put("/oef/cab/post-event/update",controller.updateOefCabPostEventReport)
router.get("/oef/cab/event/:id",controller.getOefCabPostEventReportById)


module.exports = router