const express = require('express')
const path = require('path')
const router = express.Router()
const cors = require('cors')
const mongoose = require('mongoose')
const multer = require('multer')
const logger = require('volleyball')
//const upload = multer({ dest: 'uploads/' })
const Product = require('./models/product')
const port = process.env.PORT || 3000
const app = express()

mongoose.connect(
  "mongodb://localhost/productdb",
  {
    //useMongoClient: true
  }
)
mongoose.Promise = global.Promise

app.use(logger)
//app.use(cors)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  // if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
  //   cb(null, true);
  // } else {
  //   cb(null, false);
  // }
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  // Check mime
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('productImage')

router.get('/products', (req, res) => {
  Product.find().then((products) => {
    res.status(200).json(products)
  })
})

router.post('/product', (req, res) => {

  upload(req, res, (err) => {
    if (err) {
      console.log(err)
      res.status(403).json({message: err})
    } else {
      if (req.file == undefined) {
        res.status(403).json({ message: `No file selected!` })
      } else {
        let product = new Product({
          _id: mongoose.Types.ObjectId(),
          name: req.body.name,
          price: req.body.price,
          productImage: req.file.path
        })

        product
          .save()
          //  .exec()
          .then(product => {
            res.status(200).json(product)
          })
          .catch(err => {
            console.log(err)
            res.status(500).json(err)
          })
      }
    }
  })
})

app.use('/', router)

app.listen(port, () => {
  console.log(`Server Up ! on port ${port}`)
})
