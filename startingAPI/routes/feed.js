const express= require("express")
const feedController= require('../controllers/feed')
const { body }= require('express-validator/check')

const router = express.Router()

//get
router.get('/posts', feedController.getPosts)

//post
router.post('/posts', [
    body('title').trim().isLength({min: 7}),
    body('content').trim().isLength({min: 5})
] ,feedController.postPost)

router.get('/post/:postId', feedController.getPost)

module.exports= router