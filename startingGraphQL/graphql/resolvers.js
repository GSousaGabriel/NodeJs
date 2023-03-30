const bcrypt = require('bcryptjs')
const validator = require('validator')
const { clearImage } = require('../util/fileManagement')

const User = require('../models/user')
const Post = require('../models/post')
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors = []

        if (!validator.isEmail(userInput.email)) {
            errors.push({ message: 'E-mail invalid!' })
        }

        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({ message: 'Invalid password!' })
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input!')
            error.data = errors
            error.code = 422
            throw error
        }

        const existingUser = await User.findOne({ email: userInput.email })

        if (existingUser) {
            const error = new Error('User already exists!')
            throw error
        }
        const hashedPass = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPass
        })
        const saved = await user.save()
        return { ...saved._doc, _id: saved._id.toString() }
    },

    loginUser: async function ({ email, password }) {
        const user = await User.findOne({ email })

        if (!user) {
            const error = new Error('User not Found')
            error.code = 401
            throw error
        }

        const equal = await bcrypt.compare(password, user.password)

        if (!equal) {
            const error = new Error('Wrong password!')
            error.code = 401
            throw error
        }
        const token = jwt.sign({
            userId: user._id.toString(),
            email
        }, 'supersecrettoken', { expiresIn: '1h' })
        return {
            token,
            userId: user._id.toString()
        }
    },

    createPost: async function ({ postInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }
        const errors = []

        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })) {
            errors.push({ message: 'Small content!' })
        }

        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
            errors.push({ message: 'Small title!' })
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input!')
            error.data = errors
            error.code = 422
            throw error
        }

        const user = await User.findById(req.userId)

        if (!user) {
            const error = new Error('Invalid user!')
            error.code = 401
            throw error
        }

        const post = await new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            author: user
        })

        const savedPost = await post.save()
        user.posts.push(savedPost)
        await user.save()
        return { ...savedPost._doc, _id: savedPost._id.toString(), createdAt: savedPost.createdAt.toISOString(), updatedAt: savedPost.updatedAt.toISOString() }
    },

    getPosts: async function ({ cPage }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }

        if (!cPage) {
            cPage = 1
        }

        const perPage = 2
        const totalPosts = await Post.find().countDocuments()
        const posts = await Post.find().sort({ createdAt: -1 }).skip((cPage - 1) * perPage).limit(perPage).populate('author')
        return {
            posts: posts.map(p => {
                return { ...p._doc, _id: p._id.toString(), createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }
            }), totalPosts
        }
    },

    getPost: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }
        const post = await Post.findById(id).populate("author")
        if (!post) {
            const error = new Error('No post found!')
            error.code = 404
            throw error
        }
        return { ...post._doc, _id: post._id.toString(), createdAt: post.createdAt.toISOString(), updatedAt: post.updatedAt.toISOString() }
    },

    updatePost: async function ({ id, postInput }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }
        const post = await Post.findById(id).populate("author")
        if (!post) {
            const error = new Error('No post found!')
            error.code = 404
            throw error
        }
        if (post.author._id.toString() != req.userId.toString()) {
            const error = new Error('Not authorized!')
            error.code = 403
            throw error
        }
        const errors = []

        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })) {
            errors.push({ message: 'Small content!' })
        }

        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
            errors.push({ message: 'Small title!' })
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input!')
            error.data = errors
            error.code = 422
            throw error
        }

        post.title = postInput.title
        post.content = postInput.content
        if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl
        }

        const updatedPost = await post.save()
        return { ...updatedPost._doc, _id: updatedPost._id.toString(), createdAt: updatedPost.createdAt.toISOString(), updatedAt: updatedPost.updatedAt.toISOString() }
    },

    deletePost: async function ({ id }, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }
        const post = await Post.findById(id)
        if (!post) {
            const error = new Error('No post found!')
            error.code = 404
            throw error
        }
        if (post.author.toString() != req.userId.toString()) {
            const error = new Error('Not authorized!')
            error.code = 403
            throw error
        }
        clearImage(post.imageUrl)
        post.deleteOne({ _id: id })
        const user = await User.findById(req.userId)
        user.posts.pull(id)
        await user.save()
        return true
    },

    getStatus: async function (params, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }

        const user = await User.findById(req.userId)
        return user
    },

    updateStatus: async function ({newStatus}, req) {
        if (!req.isAuth) {
            const error = new Error('Not authenticated!')
            error.code = 401
            throw error
        }

        const user = await User.updateOne({_id: req.userId}, {status: newStatus})
        return user.acknowledged
    }
}