const express = require('express')
const router = express.Router()
const controller = require('../controllers/csvControllers')

router.get("/quarterly_report_subcon",controller.getQuarterlyReportSubcon)
router.get("/cab_quarterly_report_subcon",controller.getCabCsvData)
router.get("/cbt_report_contractor",controller.getCbtCsvData)
router.get("/sv_report_contractor",controller.getSiteVisitsCsvData)
router.get("/ta_report_contractor",controller.getTechnicalAssistanceCsvData)
router.get("/participant_survey_outputs_session1",controller.getYipSession1CsvData)
router.get("/participant_survey_outputs_session2",controller.getYipSession2CsvData)
router.get("/participant_survey_outputs_session3",controller.getYipSession3CsvData)
router.get("/participant_survey_outputs_session4",controller.getYipSession4CsvData)
router.get("/yip_pre_workshop",controller.getYipPreWorkshopCsvData)
router.get("/yip_6months",controller.getYip6MonthsCsvData)



module.exports = router