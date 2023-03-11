const express= require("express")
const feedController= require('../controllers/feed')
const { body }= require('express-validator/check')
const isAuth= require('../middlewares/is-auth')

const router = express.Router()

//get
router.get('/posts', isAuth, feedController.getPosts)

//post
router.post('/posts', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
] ,feedController.postPost)

router.get('/post/:postId', feedController.getPost)

//put
router.put('/post/:postId', isAuth, [
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})
], feedController.putPost)

//delete
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports= router