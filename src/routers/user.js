const router = require('express').Router()
const userController = require('../controllers/user.js')

router.get('/',userController.GET)
router.get('/:userId',userController.GET)


module.exports = router