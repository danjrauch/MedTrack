'use strict'

const http = require('http')
const port = process.env.PORT || 4000 
const path = require('path')
const request = require('request')
const json = require('json')
const cookieParser = require('cookie-parser') 
const cookieSession = require('cookie-session')
//..const session = require('express-session')
const bodyParser = require('body-parser') //..need this for sending info from html to node
const express = require('express')
const app = express()

app.set('port', port) 
app.set('views', 'views')
app.use(express.static(__dirname))
app.use(cookieSession({
  name: 'session',
  keys: ['rauch'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(cookieParser('brad'))
const urlencodedParser = bodyParser.urlencoded({ extended: false }) //..need this for sending info from html to node

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

app.get('/', (req, res) => {
  res.redirect('/login')
  //res.render('pages/index.ejs')
})

app.get('/login', (req, res) => {
  res.render('pages/login.ejs')
})

app.post('/verifyUser', urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400)
  console.log(req.body.username)
  console.log(req.body.password)

  //..begin storing and managing user information
})