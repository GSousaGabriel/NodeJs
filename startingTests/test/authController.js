const expect = require('chai').expect
const sinon = require('sinon')
const authController = require('../controllers/auth')
const User = require('../models/user')
const mongoose = require('mongoose')

describe('auth Controller - login', () => {
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

    it('Should throw an error 500 if no access to db', (done) => {
        sinon.stub(User, 'findOne')
        User.findOne.throws()

        const req = {
            body: {
                email: 'test@gmail.com',
                password: 'treste'
            }
        }

        authController.login(req, {}, () => { }).then(result => {
            expect(result).to.be.an('error')
            expect(result).to.have.property('statusCode', 500)
            done()
        }).catch(done)

        User.findOne.restore()
    })

    it('Should send response if user has status', (done) => {
        const req = { userId: '5c0f66b979af55031b34728a' }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code
                return this
            },
            json: function (data) {
                this.userStatus = data.status
            }
        }
        authController.getUserStatus(req, res, () => { }).then(result => {
            expect(res.statusCode).to.be.equal(200)
            expect(res.userStatus).to.be.equal('I am new!')
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