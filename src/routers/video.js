const router = require('express').Router()
const multer = require('multer')
const validator = require('../middlewares/validation.js')
const videoController = require('../controllers/video.js')
const videoUpload = multer()

router.get('/',videoController.GET)
router.get('/:videoId',videoController.GET)
router.get('/download/videos/:videoLink',videoController.DOWNLOAD)
router.post('/',validator.validToken,videoUpload.single('video'),validator.validFileUpload,videoController.POST)
router.put('/',validator.validToken,videoController.PUT)
router.delete('/',validator.validToken,videoController.DELETE)

module.exports = router