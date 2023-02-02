const getDb = require('../util/database').getDb
const mongodb= require('mongodb')

class User {
    constructor(username, pass){
        this.username= username
        this.pass= pass
    }

    save(){
        const db= getDb()
        return db.collection('users')
        .insertOne({_id: this.username, pass: this.pass})
        .then(user => {
            return user
          })
          .catch(err => {
            console.log(err)
          })
    }

    static findOne(username){
        const db= getDb()
        return db.collection('users')
        .find({_id: username})
        .toArray()
        .then(user => {
            console.log(user)
            return user
          })
          .catch(err => {
            console.log(err)
          })
    }
}

module.exports= User;