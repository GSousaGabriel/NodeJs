const mongoose= require('mongoose')
const Schema= mongoose.Schema

const userSchema= new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  cart:{
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
      },
      quantity:{
        type: Number,
        required: true
      }
    }]
  }
})

userSchema.methods.addToCart= function(product){
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
    cartItems.push({productId: product._id, quantity: quantity})
  }

  const updatedCart= {
    items: cartItems
  }
  this.cart= updatedCart
  return this.save()
}

userSchema.methods.deleteItem= function(prodId){
  const updatedCartItems= this.cart.items.filter(item=>{
    return item.productId.toString() != prodId.toString()
  })
  this.cart.items= updatedCartItems
  return this.save()
}

userSchema.methods.deleteCart= function(){
  this.cart.items= []
  return this.save()
}

module.exports= mongoose.model('User', userSchema);