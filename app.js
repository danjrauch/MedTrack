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
const auth = require(path.resolve( __dirname, "./auth.js" ))
const signup = require(path.resolve( __dirname, "./signup.js" ))
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

app.post('/verifyUser', urlencodedParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400)
  // console.log(req.body.username)
  // console.log(req.body.password)

  const status = await auth.checkUser(req.body.username, req.body.password)
  if(status == 'signup'){
    res.render('pages/signup.ejs')
  }
  else if(status == 'login successful'){
    res.render('pages/index.ejs')
  }
  else if(status == 'login unsuccessful'){
    res.send({LoginStatus: 'Failed - Username and/or Password are incorrect'}) //..need to make this pretty 
  }
})

app.get('/signup', (req, res) => {
  res.render('pages/signup.ejs')
})

app.post('/createUser', urlencodedParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400)
  // console.log(req.body.username)
  // console.log(req.body.password)

  const status = await signup.signupUser(req.body.name, req.body.username, req.body.password)
  console.log(status)
  if(status == 'already signed up' || status == 'signed up'){
    res.render('pages/login.ejs')
  }
  else{
    res.send(status)
  }
})