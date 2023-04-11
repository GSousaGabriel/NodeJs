const authMiddleware= require('../middleware/is-auth')
const expect= require('chai').expect
const jwt= require('jsonwebtoken')
const sinon= require('sinon')

describe('auth middleware', ()=>{
    it('Should throw an error if no authorization header is present', ()=>{
        const req={
            get: function(){
                return null
            }
        }
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw('Not authenticated.')
    })
    
    it('should have an userId', ()=>{
        const req= {
            get: ()=>{
                return 'Bearer somesupersecretsecret'
            }
        }

        sinon.stub(jwt, 'verify')
        jwt.verify.returns({userId: 'das'})

        authMiddleware(req, {}, ()=>{})
        expect(req).to.have.property('userId')
        jwt.verify.restore()
    })
    
    it('should throw an error if the authorization header is only one string', ()=>{
        const req= {
            get: ()=>{
                return 'xx'
            }
        }
        expect(authMiddleware.bind(this, req, {}, ()=>{})).to.throw()
    })
})