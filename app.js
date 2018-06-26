"use strict"

const http = require("http")
const port = process.env.PORT || 4000

const path = require("path")
const request = require("request")
const json = require("json")
const cookieParser = require("cookie-parser")
//const session = require('cookie-session')
const pg = require("pg")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const passport = require("passport")
const bodyParser = require("body-parser") //..need this for sending info from html to node
const expressValidator = require("express-validator")
const express = require("express")
const db = require(path.resolve(__dirname, "./db.js"))
const auth = require(path.resolve(__dirname, "./auth.js"))
const signup = require(path.resolve(__dirname, "./signup.js"))
const feedback = require(path.resolve(__dirname, "./feedback.js"))
const app = express()

app.set("port", port)
app.set("views", "views")
app.set("view engine", "ejs")
app.use(express.static(__dirname))
const urlencodedParser = bodyParser.urlencoded({ extended: false }) //..need this for sending info from html to node
app.use(cookieParser())
app.use(expressValidator())

const connectionString =
  process.env.DATABASE_URL || "postgresql://localhost:5432/medtrack"

let pgPool = new pg.Pool({
  connectionString: connectionString
})

app.use(session({
  name: 'session',
  store: new pgSession({
    pool : pgPool,                // Connection pool
  }),
  secret: 'yellowstone',
  keys: ['yellowstone'],
  resave: false,
  saveUninitialized: false, 
  // cookie: {secure: true},   //..MAY CAUSE A PROBLEM 6.26.2018

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.isAuthenticated ? (res.locals.firstname = req.session.passport.user.firstname): (res.locals.firstname = undefined)
  next()
})

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"))
})

app.get("/", (req, res) => {
  res.redirect("/home")
})

app.get("/home", (req, res) => {
  res.render("pages/home")
})

app.get("/profile", authenticationMiddleware(), (req, res) => {
  res.render("pages/profile")
})

app.get("/login", (req, res) => {
  res.render("pages/login")
})

app.post("/login", urlencodedParser, async (req, res) => {
  if (!req.body) return res.sendStatus(400)
  req.checkBody("username", "Username field cannot be empty.").notEmpty()
  req.checkBody("username", "Username must be between 4-15 characters long.").len(4, 15)
  req.checkBody("password", "Password must be between 8-20 characters long.").len(8, 20)
  req.checkBody("password","Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*)(?=.*[^a-zA-Z0-9]).{8,}$/,"i")
  req.checkBody("username","Username can only contain letters, numbers, or underscores.").matches(/^[A-Za-z0-9_-]+$/, "i")

  const errors = req.validationErrors()
  if(errors) {
    console.log(errors)
    res.render("pages/login", { errors: errors })
  }else{
    try{
      const status = await auth.checkUser(req.body.username, req.body.password)
      if(status == "signup"){
        res.render("pages/login", {errors: [{ msg: "Sorry, there is no user with that username." }]})
      }else if(status == "successful"){
        //..create a user session
        const user = await db.query({
          name: "fetch-user",
          text: "SELECT * FROM users WHERE username = $1",
          values: [req.body.username]
        })
        // console.log(user)
        const userProps = {id: user[0].id, firstname: user[0].firstname, userName: user[0].username}
        //..where we do the serialization
        req.login(userProps, err => {
          res.redirect("/profile")
        })
        //..created a user session
      }else if(status == "unsuccessful"){
        res.render("pages/login", {errors: [{msg: "Login Unsuccessful. Username and/or Password are incorrect."}]})
      }
    }catch (err){
      console.log(err.stack)
    }
  }
});

app.get("/logout", (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect("/")
})

app.get("/signup", (req, res) => {
  res.render("pages/signup")
})

app.post("/signup", async (req, res) => {
  if (!req.body) return res.send({error: 'theres an issue'})
  req.checkBody("username", "Username field cannot be empty.").notEmpty()
  req.checkBody("username", "Username must be between 4-15 characters long.").len(4, 15)
  req.checkBody("password", "Password must be between 8-20 characters long.").len(8, 20)
  req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*)(?=.*[^a-zA-Z0-9]).{8,}$/,"i")
  req.checkBody("username", "Username can only contain letters, numbers, or underscores.").matches(/^[A-Za-z0-9_-]+$/, "i")

  const errors = req.validationErrors()
  if(errors){
    console.log(errors)
    res.render("pages/signup", { errors: errors })
  }else{
    const status = await signup.signupUser(req.body.firstname, req.body.lastname, req.body.username, req.body.password)
    if(status == "signed up"){
      res.redirect("/login")
    }else if(status == "username already used"){
      res.render("pages/signup", { errors: [{ msg: "Sorry, there is already a user with that username." }] })
    }else{
      res.send(status)
    }
  }
})

passport.serializeUser((user, done) => {
  done(null, {
    id: user.id,
    firstname: user.firstname
  })
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`)
    if (req.isAuthenticated()) return next()
    res.redirect("/login")
  }
}

app.get("/feedback", (req, res) => {
  res.render("pages/feedback")
})

app.post("/feedback", urlencodedParser, (req, res) => {
  if (!req.body) return res.sendStatus(400)
  //console.log(typeof req.body.emailbody)
  res.redirect("/profile")
  feedback.sendFeedback(req.body.emailbody)
})