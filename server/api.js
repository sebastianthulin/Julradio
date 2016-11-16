'use strict'

const {Router} = require('express')
const userController = require('./controllers/user')
const commentController = require('./controllers/comment')
const articlesController = require('./controllers/articles')
const chatController = require('./controllers/chat')
const requestController = require('./controllers/request')
const notificationController = require('./controllers/notification')
const reservationsController = require('./controllers/reservations')
const crewController = require('./controllers/crew')
const forgotController = require('./controllers/forgot')
const misq = require('./controllers/misq')
const {fetchUser, signedIn, role} = require('./middleware')

const api = Router()
const user = Router()
const comment = Router()
const articles = Router()
const chat = Router()
const request = Router()
const notification = Router()
const reservations = Router()
const crew = Router()
const forgot = Router()

user
  .get('/logout', userController.logOut)
  .get('/byname/:username', userController.show)
  .get('/search', userController.search)
  .get('/profile', userController.showProfile)
  .post('/signup', userController.signUp)
  .post('/login', userController.logIn)
  .post('/block', signedIn, userController.block)
  .delete('/block/:userId', signedIn, userController.unBlock)
  .put('/settings', signedIn, userController.updateSettings1)
  .put('/settings2', signedIn, userController.updateSettings2)
  .post('/profilepicture', signedIn, userController.createProfilePicture)
  .delete('/profilepicture', signedIn, userController.deleteProfilePicture)
  .get('/all', role('admin'), userController.listAll)
  .delete('/:userId/avatar', role('admin'), userController.deleteUserProfilePicture)
  .put('/:userId', role('admin'), userController.updateUser)

comment
  .get('/:type', commentController.show)
  .get('/replies/:id', commentController.showReplies)
  .post('/article', signedIn, commentController.createOnArticle)
  .post('/user', signedIn, commentController.createOnUser)
  .post('/cosycorner', signedIn, commentController.createOnCosycorner)
  .post('/reply', signedIn, commentController.reply)
  .delete('/:id', signedIn, fetchUser, commentController.delete)

articles
  .get('/', articlesController.frontPage)
  .get('/all', articlesController.list)
  .get('/:id', articlesController.show)
  .post('/', role('writer'), articlesController.create)
  .put('/pin', role('writer'), articlesController.pin)
  .put('/:id', role('writer'), articlesController.update)
  .delete('/:id', role('writer'), articlesController.delete)

chat
  .get('/', signedIn, chatController.list)
  .get('/:id/:offset', signedIn, chatController.fetch)

request
  .post('/', requestController.create)
  .get('/', role('radioHost'), requestController.showUngranted)
  .put('/:id', role('radioHost'), requestController.grant)
  .delete('/:id', role('radioHost'), requestController.deny)
  .delete('/all', role('radioHost'), requestController.wipe)
  .delete('/accepted/:id', role('admin'), requestController.deleteRequest)
  .delete('/tweet/:id', role('admin'), requestController.deleteTweet)

notification
  .get('/', signedIn, notificationController.showAll)
  .post('/', signedIn, notificationController.clear)

reservations
  .post('/', role('radioHost'), reservationsController.create)
  .put('/:id', role('radioHost'), reservationsController.update)
  .delete('/:id', role('radioHost'), reservationsController.delete)

crew
  .get('/', crewController.showAll)
  .put('/', role('admin'), crewController.update, crewController.showAll)

forgot
  .post('/', forgotController.request)
  .get('/:requestId', forgotController.show)
  .post('/:requestId', forgotController.finish)

api.use('/user', user)
api.use('/comment', comment)
api.use('/articles', articles)
api.use('/chat', chat)
api.use('/request', request)
api.use('/notification', notification)
api.use('/reservations', reservations)
api.use('/crew', crew)
api.use('/forgot', forgot)

module.exports = api
