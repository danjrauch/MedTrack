const db = require("./db.js")
const bcrypt = require("bcrypt")
const saltRounds = 10

module.exports = {
  signupUser
}

async function signupUser(firstname, lastname, username, password) {
  console.log('here')
  try{
    const user = await db.query({
      name: "fetch-user",
      text: "SELECT * FROM users WHERE username = $1",
      values: [username]
    })
    if(user.length != 0){
      return "username already used"
    }
    const passwordhash = await bcrypt.hash(password, saltRounds)
    await db.insert({
      text:"INSERT INTO users(firstname, lastname, username, passwordhash) VALUES($1, $2, $3, $4)",
      values: [[firstname, lastname, username, passwordhash]]
    })
    return "signed up"
  }catch (err){
    console.log(err.stack)
    return err
  }
}
