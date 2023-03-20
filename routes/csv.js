const express = require('express')
const router = express.Router()
const controller = require('../controllers/csvControllers')

router.get("/quarterly_report_subcon",controller.getQuarterlyReportSubcon)
router.get("/cab_csv",controller.getCabCsvData)



module.exports = router