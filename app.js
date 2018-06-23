'use strict'

const http = require('http')
const port = process.env.PORT || 4000 
const path = require('path')
const request = require('request')
const json = require('json')
const cookieParser = require('cookie-parser') 
const cookieSession = require('cookie-session')
//..const session = require('express-session')
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

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})
