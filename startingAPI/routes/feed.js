const express= require("express")
const feedController= require('../controllers/feed')

const router = express.Router()

//get
router.get('/posts', feedController.getPosts)

//post
router.post('/posts', feedController.postPost)

module.exports= router