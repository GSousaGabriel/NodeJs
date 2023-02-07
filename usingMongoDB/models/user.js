const getDb = require('../util/database').getDb
const mongodb= require('mongodb')

class User {
    constructor(username, pass, cart, orders){
        this.username= username
        this.pass= pass
        this.cart= cart
        this.orders= orders
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

    addProduct(product){
      if(!this.cart){
        this.cart= {items:[]}
      }
      const cartItem= this.cart.items.findIndex(item =>{
        return item.productId.toString()===product._id.toString()
      })
      let cartItems= [...this.cart.items]
      let quantity= 1

      if(cartItem=== 0){
        quantity= cartItems[cartItem].quantity +1
        cartItems[cartItem].quantity= quantity
      }else{
        cartItems.push({productId: new mongodb.ObjectId(product._id), quantity: quantity})
      }

      const updatedCart= {
        items: cartItems
      }
      const db= getDb()

     return db.collection('users')
      .updateOne({_id: this.username},
         {
          $set: {
            cart: updatedCart
          }
        })
    }

    deleteItem(id){
      let updatedCart= {
        items:[]
    }
      const db= getDb()

      for (let index = 0; index < this.cart.items.length; index++) {
        if(this.cart.items[index].productId.toString() != id){
          updatedCart.items.push(this.cart.items[index])
        }
      }

     return db.collection('users')
      .updateOne({_id: this.username},
         {
          $set: {
            cart: updatedCart
          }
        })
    }

    deleteItemOrder(id){
      let openOrder= this.orders.length-1
      let orders= this.orders
      let order= this.orders[openOrder]
      const db= getDb()
      let items= []

      for (let index = 0; index < order.items.length; index++) {
        if(order.items[index].productId.toString() != id){
          items.push(order.items[index])
        }
      }

      order.items= items
      orders[openOrder]= order

     return db.collection('users')
      .updateOne({_id: this.username},
         {
          $set: {
            orders
          }
        })
    }

    updateOrder(){
      const db= getDb()
      let items= []
      if(this.cart){
        items= this.cart.items
      }else{
        let openOrder= this.orders.length-1
        items= this.orders[openOrder].items
      }
      let orders= [{
        id: 1,
        items,
        open: true
      }]
      let hasOpenOrder= false

      if(this.orders){
        for (let index = 0; index < this.orders.length; index++) {
          if(this.orders[index].isOpen){
            hasOpenOrder= true
            orders= this.orders
          }
        }
      }
      if(hasOpenOrder){
        for (let index = 0; index < items.length; index++) {
          for (let i = 0; i < orders.items.length; i++) {
            if(items[index].productId=== orders.items[i].productId){
              orders.items[i]
            }
          }
        }
      }
      return db.collection('users')
      .updateOne({_id: this.username},
         {
          $set: {
            orders,
            cart: undefined
          }
        })
    }
}

module.exports= User;