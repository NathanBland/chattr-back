var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var roomController = require('./controllers/room')
var userController = require('./controllers/user')
var authController = require('./controllers/auth')

var config = require('./config')

try {
  mongoose.connect('mongodb://' + config.mongo.username + ':' + config.mongo.password + '@' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
  console.log('[mongo] succesfully connected to mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
} catch (err) {
  console.log('[mongo] failed to connect to mongodb://' + config.mongo.address + ':' + config.mongo.port + '/' + config.mongo.database)
  console.log(err)
}

var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))

var router = express.Router()

router.route('/room')
  .post(authController.isAuthenticated, roomController.createRoom)
  .get(authController.isAuthenticated, roomController.getRooms)

router.route('/room/:name')
  .get(authController.isAuthenticated, roomController.getRoom)

router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers)

router.route('/auth')
  .get(authController.isAuthenticated, userController.isAuthenticated)

app.use('/api', router)

app.listen(config.express.port)
console.log('[server] running at port ' + config.express.port)