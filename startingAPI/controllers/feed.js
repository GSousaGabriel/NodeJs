const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const User = require('../models/user')
const fs = require('fs')
const path = require('path')

exports.getPosts = (req, res, next) => {
    const currrentPage = req.query.page || 1
    const perPage = 2
    let totalItems;

    Post.find().countDocuments()
        .then(qtd => {
            totalItems = qtd
            return Post.find().skip((currrentPage - 1) * perPage).limit(perPage)
        })
        .then(posts => {
            res.status(200).json({ message: "success", posts, totalItems })
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
    if (!req.file) {
        const error = new Error("No image!")
        error.statusCode = 422
        throw error
    }
    const imageUrl = req.file.path
    const title = req.body.title
    const content = req.body.content
    let currentPost;
    let creator;
    const post = new Post({
        title,
        content,
        imageUrl: imageUrl,
        creator: req.userId
    })
    post.save()
        .then(post => {
            currentPost = post
            console.log(post)
            return User.findById(req.userId)
            //create a post
        })
        .then(user => {
            creator = user
            user.posts.push(post)
            return user.save()
        })
        .then(creator => {
            res.status(201).json({
                message: "Successfully created",
                post: currentPost,
                creator: {
                    _id: creator._id,
                    name: creator.name
                }
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
}

exports.putPost = ((req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const error = new Error("Error validating")
        error.statusCode = 422
        throw error
    }
    if (!req.file) {
        const error = new Error("No image!")
        error.statusCode = 422
        throw error
    }
    const postId = req.params.postId
    const title = req.body.title
    const content = req.body.content
    let imageUrl = req.body.image

    if (req.file) {
        imageUrl = req.file.path
    }

    if (!imageUrl) {
        const error = new Error("No file")
        error.statusCode = 422
        throw error
    }

    Post.findById(postId)
        .then(post => {
            if (post.creator.toString() === req.userId) {
                if (imageUrl != post.imageUrl) {
                    clearImage(post.imageUrl)
                }
                return Post.updateOne({ _id: postId }, { title, content, imageUrl })
            } else {
                const error = new Error("Not your post")
                error.statusCode = 403
                throw error
            }

        })
        .then(success => {
            console.log(success)
            //create a post
            res.status(201).json({
                message: "Successfully updated"
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
})

exports.deletePost = ((req, res, next) => {
    const postId = req.params.postId

    Post.findById(postId)
        .then(post => {
            if (post.creator.toString() === req.userId) {
                clearImage(post.imageUrl)
                return Post.deleteOne({ _id: postId })
            } else {
                const error = new Error("Not your post")
                error.statusCode = 403
                throw error
            }
        })
        .then(success => {
            console.log(success)
            return User.findById(req.userId)
        })
        .then(user=>{
            user.posts.pull(postId)
            return user.save()
        }).then(success=>{
            res.status(201).json({
                message: "Successfully deleted"
            })
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500
            }
            next(error)
        })
})

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}