const { validationResult } = require('express-validator/check')
const Post = require('../models/post')

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => {
            res.status(200).json({ message: "success", posts })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}

exports.getPost = (req, res, next) => {
    const postId = req.params.postId
    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error("Could not find the post")
                error.statusCode = 404
                throw error
            }
            res.status(200).json({ message: "success", post })
        })
        .catch(error => {
            console.log(error)
        })
}

exports.postPost = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error("Error validating")
        error.statusCode = 422
        throw error
    }
    if(!req.file){
        const error= new Error("No image!")
        error.statusCode = 422
        throw error
    }
    const imageUrl = req.file.path
    const title = req.body.title
    const content = req.body.content
    const post = new Post({
        title,
        content,
        imageUrl: imageUrl,
        creator: {
            name: 'Gabriel'
        }
    })
    post.save()
        .then(success => {
            console.log(success)
            //create a post
            res.status(201).json({
                message: "Successfully created"
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}