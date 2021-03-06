// Express docs: http://expressjs.com/en/api.html
const express = require('express')

// pull in Mongoose model for products
const Product = require('../models/product')

// we'll use this to intercept any errors that get thrown and send them
// back to the client with the appropriate status code
const handle = require('../../lib/error_handler')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /products
router.get('/products', (req, res) => {
  Product.find()
    .then(products => {
      // `products` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return products.map(product => product.toObject())
    })
    // respond with status 200 and JSON of the products
    .then(products => res.status(200).json({ products: products }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

// SHOW
// GET /products/5a7db6c74d55bc51bdf39793
router.get('/products/:id', (req, res) => {
  // req.params.id will be set based on the `:id` in the route
  Product.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "product" JSON
    .then(product => res.status(200).json({ product: product.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(err => handle(err, res))
})

module.exports = router
