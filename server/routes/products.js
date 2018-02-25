const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const Product = require('../models/product')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads/')
  },
  filename: (req, file, callback) => {
    callback(null, new Date().toISOString() + file.originalname);
  }
})

const fileFilter = (req, file, callback) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    callback(null, true)
  } else {
    callback(null, false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            category: doc.category,
            _id: doc._id
          }
        })
      }
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.post('/', upload.single('productImage'), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
    category: req.body.category
  })
  product
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
            name: result.name,
            price: result.price,
            category: result.category,
            _id: result._id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.get('/:category', (req, res) => {
  var category = req.params.category

  Product.find({
    category: category,
  }).sort('name')
  .select('name price _id productImage')
  .exec()
  .then((products) => {
    if (products.length === 0) {
      return res.status(404).send()
    }
    res.send({products})
  }).catch((e) => {
    res.status(400).send()
  })
})

module.exports = router
