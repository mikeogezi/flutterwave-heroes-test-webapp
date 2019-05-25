'use strict'

// \n.{1,}\| &#x9.*

let path = require('path')

let express = require('express')
let stylus = require('stylus')
let nib = require('nib')
let bodyParser = require('body-parser')
let favicon = require('serve-favicon')
let multer = require('multer')
let ms = require('ms')
let compression = require('compression')

let routes = require('./app/routes')

let compile = (str, _path) => {
    return stylus(str).set('filename', _path).use(nib());
}

let app = express()

app.set('homedir', __dirname)
app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/public/views/pug')
app.set('view engine', 'pug')

app.locals.year = new Date().getFullYear()
app.locals.designerPersonThree = 'Michael Ogezi'
app.locals.designerPersonThreeSite = 'http://github.com/okibeogezi'

app.use(compression())
app.use(express.static(path.join(__dirname + '/public'), {
    maxAge: process.env.NODE_ENV == 'production' ? ms('365 days') : ms('0')
}))
app.use(bodyParser.json())
app.use(favicon(path.join(__dirname, '/public/images/icon.ico')))
app.use(stylus.middleware({
    src: path.join(__dirname, '/public'),
    compile: compile
}))
app.use(bodyParser.urlencoded({
    extended: false
}))

// app.locals.rootUrl = 'http://localhost:3000/'

// home page
app.get('/', routes.index)

// customer validation form
app.get('/customerValidation', routes.getCustomerValidation)
app.post('/customerValidation', routes.postCustomerValidation)
app.get('/customerValidation/complete', routes.customerValidationDone)

// ride sharing
app.get('/rideSharing', routes.getRideSharing)
// app.post('/rideSharing', routes.postRideSharing)
app.get('/rideSharing/complete/:detailsJSON', routes.rideSharingDone)
app.get('/pay', (req, res, next) => {
	res.sendFile(path.join(__dirname, '/public/pay.html'))
})

app.locals.pretty = true

app.listen(app.get('port'), () => {
    console.log(`Listening or port ${app.get('port')} in ${process.env.NODE_ENV} mode`)
})
