const db = require("./db.js")
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  signupUser
}

async function signupUser(name, username, password) {
  try{
    const user = await db.query({
      name: 'fetch-user',
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    })
    if(user.length != 0){
      return 'already signed up'
    }
    const passwordHash = await bcrypt.hash(password, saltRounds)
    await db.insert({
      text: 'INSERT INTO users(name, username, passwordhash) VALUES($1, $2, $3)',
      values: [[name, username, passwordHash]]
    })
    return 'signed up'
  }catch (err){
    console.log(err.stack)
    return err
  }
}