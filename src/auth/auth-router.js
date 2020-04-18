const express = require('express')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const AuthService = require('./auth-service')

  authRouter
  .route('/login')
 
  .get((req, res) => {
      res.send('Hi')
  })
  .post( jsonBodyParser, (req, res, next) => {
     const { email, password } = req.body
     const loginUser = { email, password }
     //check that both email, and password fields coming in request
     for (const [key, value] of Object.entries(loginUser))
       if (value == null)
         return res.status(400).json({
           error: `Missing '${key}' in request body`
         })

//check for username in database
AuthService.getUserWithUserName(
    req.app.get('db'),
    loginUser.email
  )
    .then(dbUser => {
      if (!dbUser)
        return res.status(400).json({
          error: 'Incorrect email or password',
        })
//if user is there, compare stored password hash to hash of this password
    return AuthService.comparePasswords(loginUser.password, dbUser.password)
      .then(compareMatch => {
        if (!compareMatch)
          return res.status(400).json({
            error: 'Incorrect email or password',
          })

//send JWT in the response so client can use it to store to prove user is logged in
const sub = dbUser.email
        const payload = { user_id: dbUser.id, companyid: dbUser.companyid, isadmin: dbUser.isadmin, full_name: dbUser.full_name }
        res.send({
          authToken: AuthService.createJwt(sub, payload),
        })
       })
   })
    })

module.exports = authRouter