const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  isOpen: Boolean
})

orderSchema.methods.addToOrder = function (items) {
  for (let index = 0; index < this.items.length; index++) {
    for (let i = 0; i < items.length; i++) {
      if(this.items[index].productId.toString() === items[i].productId.toString()){
        this.items[index].quantity= this.items[index].quantity + items[i].quantity
      }else{
        this.items.push(items[i])
      }
    }
  }
  return this.save()
}

orderSchema.methods.deleteItem= function(prodId){
  const updatedOrderItems= this.items.filter(item=>{
    return item.productId.toString() != prodId.toString()
  })
  this.items= updatedOrderItems
  return this.save()
}

module.exports = mongoose.model('Order', orderSchema);