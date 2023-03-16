const { validationResult } = require('express-validator/check')
const Post = require('../models/post')
const User = require('../models/user')
const io = require('../socket');
const fs = require('fs')
const path = require('path')

exports.getPosts = (req, res, next) => {
    const currrentPage = req.query.page || 1
    const perPage = 2
    let totalItems;

    Post.find().countDocuments()
        .then(qtd => {
            totalItems = qtd
            return Post.find().populate('creator').skip((currrentPage - 1) * perPage).limit(perPage)
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

exports.postPost = async (req, res, next) => {
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
    const post = new Post({
        title,
        content,
        imageUrl: imageUrl,
        creator: req.userId
    })
    try {
        const currentPost = await post.save()
        const user = await User.findById(req.userId)
        user.posts.push(post)
        await user.save()
        io.getIO().emit('posts', {
            action: 'create',
            post: JSON.stringify(
                { ...post._doc, creator: { _id: req.userId, name: user.name } }
            )
        });
        res.status(201).json({
            message: "Successfully created",
            post: currentPost,
            creator: {
                _id: req.userId,
                name: user.name
            }
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

exports.putPost = async (req, res, next) => {
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

    try {
        const post = await Post.findById(postId)
        if (post.creator.toString() === req.userId) {
            if (imageUrl != post.imageUrl) {
                clearImage(post.imageUrl)
            }
            const result = await Post.updateOne({ _id: postId }, { title, content, imageUrl })
            io.getIO().emit('posts', { action: 'update', post: result });
            res.status(201).json({
                message: "Successfully updated"
            })
        } else {
            const error = new Error("Not your post")
            error.statusCode = 403
            throw error
        }
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId

    try {
        const post = await Post.findById(postId)
        if (post.creator.toString() === req.userId) {
            clearImage(post.imageUrl)
            const deleted = await Post.deleteOne({ _id: postId })
        } else {
            const error = new Error("Not your post")
            error.statusCode = 403
            throw error
        }
        const user = await User.findById(req.userId)
        user.posts.pull(postId)
        await user.save()
        io.getIO().emit('posts', { action: 'delete', post: postId });
        res.status(201).json({
            message: "Successfully deleted"
        })
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500
        }
        next(error)
    }
}

const clearImage = (filePath) => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
}