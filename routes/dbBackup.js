
const express = require('express')
const router = express.Router()
const controller = require('../controllers/dbBackupControllers')

router.get("/",controller.createBackupFromClientSide)
router.get("/autobackup",controller.autoBackup)



module.exports = router