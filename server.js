const express = require('express')
const path = require('path')
const cors = require('cors')
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const logger = require('volleyball')

// Handlebars Helpers
const {
  truncate
} = require('./helpers/hbs')

const port = process.env.PORT || 3000
const app = express()

mongoose.connect(
  "mongodb://localhost/productdb",
  {
    //useMongoClient: true
  }
)
mongoose.Promise = global.Promise

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate
  },
  defaultLayout:'main'
}));
app.set('view engine', 'handlebars');
// Logger http request
app.use(logger)
app.use(cors({
  methods: ['HEAD', 'OPTIONS', 'POST'],
  credentials: true,
  maxAge: 3600,
  preflightContinue: false,
}))
// Seteamos el directorio /uploads para que puedan acceder a las imagenes.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const index = require('./routes/main')
const routerProduct = require('./routes/product')

app.use('/', index)
app.use('/product', routerProduct)

app.listen(port, () => {
  console.log(`Server Up ! on port ${port}`)
})
