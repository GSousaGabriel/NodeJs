const getDb = require('../util/database').getDb
const mongodb= require('mongodb')

class Product {
  constructor(title, price, description, imageUrl, owner) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this.owner= owner
  }

  save() {
    const db = getDb()
    return db.collection('products')
      .insertOne(this)
      .then(result => {
        console.log(result)
      })
      .catch(err => {
        console.log(err)
      })
  }

  static fetchAll(){
    const db = getDb()
    return db.collection('products')
    .find()
    .toArray()
    .then(products => {
      console.log(products)
      return products
    })
    .catch(err => {
      console.log(err)
    })
  }

  static fetchOne(id){
    const db = getDb()
    return db.collection('products')
    .find({_id: new mongodb.ObjectId(id)})
    .toArray()
    .then(product => {
      console.log(product)
      return product[0]
    })
    .catch(err => {
      console.log(err)
    })
  }

  updateOne(id){
    const db = getDb()
    return db.collection('products')
    .updateOne({_id: new mongodb.ObjectId(id)}, {$set: this})
    .then(product => {
      console.log(product)
    })
    .catch(err => {
      console.log(err)
    })
  }

  static deleteOne(id){
    const db= getDb()

    return db.collection('products')
    .deleteOne({_id: new mongodb.ObjectId(id)})
    .then(product => {
      console.log(product)
    })
    .catch(err => {
      console.log(err)
    })
  }
}

module.exports = Product;
