
const express = require('express')
const router = express.Router()
const controller = require('../controllers/dropboxAccessTokenControllers')

router.get("/",controller.getDropboxAccessToken)



module.exports = router