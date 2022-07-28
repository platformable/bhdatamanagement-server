
const express = require('express')
const router = express.Router()
const controller = require('../controllers/authorizedusersControllers')

router.get("/",controller.get)
router.delete("/",controller.delete)
router.post("/create",controller.post)
router.put("/",controller.updateUser)
router.put("/update_from_users_edit",controller.updateUserActiveStatus)


module.exports = router