'use strict'

const http = require('http')
const port = process.env.PORT || 4000 
const path = require('path')
const request = require('request')
const json = require('json')
const session = require('express-session')
const express = require('express')
const app = express()

// Generic Express config
app.set('port', port) 
app.set('views', 'views')
app.use(express.static(__dirname))
app.use(session({ resave: false, saveUninitialized: false, secret: 'smith' }))

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'))
})

app.get('/', (req, res) => {
    res.render('pages/index.ejs')
})
