const express= require("express")
const userController= require('../controllers/user')
const isAuth= require('../middlewares/is-auth')

const router = express.Router()

router.get('/status', isAuth, userController.getStatus)

router.put('/status', isAuth, userController.putStatus)

module.exports= router