const router = require('express').Router()
const multer = require('multer')
const authController = require('../controllers/auth.js')
const validator = require('../middlewares/validation.js')
const imageUpload = multer()

router.post('/login',validator.validLogin, authController.LOGIN)
router.post('/register',imageUpload.single('image'),validator.validRegister,authController.REGISTER)



module.exports = router