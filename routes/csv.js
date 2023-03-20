const express = require('express')
const router = express.Router()
const controller = require('../controllers/csvControllers')

router.get("/quarterly_report_subcon",controller.getQuarterlyReportSubcon)



module.exports = router