const bcrypt = require('bcryptjs')
const validator= require('validator')

const User = require('../models/user')

module.exports = {
    createUser: async function ({ userInput }, req) {
        const errors=[]
        
        if(!validator.isEmail(userInput.email)){
            errors.push({message: 'E-mail invalid!'})
        }

        if(validator.isEmpty(userInput.password) || validator.isLength(userInput.password, {min: 5})){
            errors.push({message: 'Invalid password!'})
        }

        if(errors.length>0){
            const error= new Error('Invalid input!')
            error.data= errors
            error.code= 422
            throw error
        }

        const existingUser = await User.findOne({ email: userInput.email })

        if (existingUser) {
            const error = new Error('User already exists!')
            throw error
        }
        const hashedPass = await bcrypt.hash(userInput.password, 12)
        const user = new User ({
            email: userInput.email,
            name: userInput.name,
            password: hashedPass
        })
        const saved= await user.save()
        return { ...saved._doc, _id: saved._id.toString() }
    }
}