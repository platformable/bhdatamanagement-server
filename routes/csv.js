const express = require('express')
const router = express.Router()
const controller = require('../controllers/csvControllers')

router.get("/quarterly_report_subcon/:startDate&:endDate",controller.getQuarterlyReportSubcon)
router.get("/cab_quarterly_report_subcon/:startDate&:endDate",controller.getCabCsvData)
router.get("/cbt_report_contractor/:startDate&:endDate",controller.getCbtCsvData)
router.get("/sv_report_contractor/:startDate&:endDate",controller.getSiteVisitsCsvData)
router.get("/ta_report_contractor/:startDate&:endDate",controller.getTechnicalAssistanceCsvData)
router.get("/participant_survey_outputs_session1/:startDate&:endDate",controller.getYipSession1CsvData)
router.get("/participant_survey_outputs_session2/:startDate&:endDate",controller.getYipSession2CsvData)
router.get("/participant_survey_outputs_session3/:startDate&:endDate",controller.getYipSession3CsvData)
router.get("/participant_survey_outputs_session4/:startDate&:endDate",controller.getYipSession4CsvData)
router.get("/yip_pre_workshop/:startDate&:endDate",controller.getYipPreWorkshopCsvData)
router.get("/yip_6months/:startDate&:endDate",controller.getYip6MonthsCsvData)
router.get("/post_event/:startDate&:endDate",controller.getPostEventCsvData)



module.exports = router