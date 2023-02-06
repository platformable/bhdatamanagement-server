
const express = require('express')
const router = express.Router()
const controller = require('../controllers/siteVisitsControllers')

router.get("/",controller.getSiteVisits)
router.get("/:id",controller.getSiteVisitById)
router.post("/",controller.createSiteVisit)
router.put("/",controller.updateSiteVisit)
router.delete("/delete",controller.deleteSiteVisit)

module.exports = router




