const expect = require('chai').expect
const feedController = require('../controllers/feed')
const User = require('../models/user')
const mongoose = require('mongoose')

describe('feed controller', () => {
    before(function (done) {
        mongoose
            .connect(
                'mongodb+srv://pasteu008:123123456@store.cqu3smq.mongodb.net/test'
            )
            .then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: '123',
                    name: 'Test',
                    posts: [],
                    _id: '5c0f66b979af55031b34728a'
                })
                return user.save()
            })
            .then(() => {
                done()
            })
    })

    it('Should have a post added to the user', (done) => {
        const req = {
             body:{
                title: "Test title",
                content: "test content",
             },
             file: {
                path: "abc"
             },
             userId: "5c0f66b979af55031b34728a"
        }
        const res = {
            status: function (code) {
                return this
            },
            json: function (data) {
            }
        }
        feedController.createPost(req, res, () => { }).then(result => {
            expect(result).to.have.property('posts')
            expect(result.posts).to.have.length(1)
            done()
        })
        .catch(done)
    })

    after(function (done) {
        User.deleteMany({}).then(() => {
            mongoose.disconnect().then(() => {
                done()
            })
        })
    })
})