
const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersControllers')

router.get("/",controller.getUsers)
router.delete("/",controller.delete)
router.post("/create",controller.createUser)
router.put('/lastlogin',controller.updateLastLogin)
router.put('/',controller.updateUser)


module.exports = router




