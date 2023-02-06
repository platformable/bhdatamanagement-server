
const express = require('express')
const router = express.Router()
const controller = require('../controllers/fbosControllers')

router.get("/",controller.getFbos)
router.get("/:id",controller.getFboById)
router.post("/",controller.createFbo)
router.put("/",controller.updateFbo)
router.delete("/delete",controller.deleteFbo)

module.exports = router




