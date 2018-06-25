const db = require("./db.js")
const bcrypt = require('bcrypt')
const saltRounds = 10

module.exports = {
  checkUser
}

async function checkUser(username, password) {
  try{
    const user = await db.query({
      name: 'fetch-user',
      text: 'SELECT * FROM users WHERE username = $1',
      values: [username]
    })
    if(user.length == 0){
      return 'signup'
    }
    const match = await bcrypt.compare(password, user[0].passwordhash) 

    if(match) {
      return 'login successful'
    }
    else{
      return 'login unsuccessful'
    }
  }catch (err){
    console.log(err.stack)
  }
}