const Product = require('../models/product')
const fileHelper = require('../util/file')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: 'admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const image = req.file
  let imageUrl = ''

  if (image) {
    imageUrl = image.path
  }

  const product = new Product({ title, price, description, imageUrl, userId: req.session.user._id })
  product.save()
    .then(result => {
      console.log('Created Product')
      return res.redirect('/admin/products')
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      })
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const image = req.file
  const updatedDesc = req.body.description
  let updatedImageUrl = ''

  const updatedProduct = {
    title: updatedTitle,
    price: updatedPrice,
    description: updatedDesc,
    imageUrl: updatedImageUrl
  }

  if (image) {
    fileHelper.deleteFile(product.imageUrl)
    updatedProduct.imageUrl = image.path
  } else {
    delete updatedProduct.imageUrl
  }

  Product.find({ _id: prodId, userId: req.user._id })
    .then(prod => {
      if (prod.length > 0) {
        return Product.updateOne({ _id: prodId }, updatedProduct)
      } else {
        res.redirect('/admin/products')
      }
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).populate('userId')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      })
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(result => {
      fileHelper.deleteFile(product.imageUrl)
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(result => {
      res.redirect('/admin/products')
    })
    .catch(error => {
      const errorReq = new Error(error)
      errorReq.httpStatusCode = 500
      return next(errorReq)
    })
}