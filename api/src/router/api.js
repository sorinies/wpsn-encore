const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const cors = require('cors')

const query = require('../query')

const router = express.Router()

router.use((req, res, next) => {
  next()
})

router.use(bodyParser.json())
router.use(expressJwt({
  secret: process.env.JWT_SECRET
}))
router.use(cors({
  origin: process.env.TARGET_ORIGIN
}))

router.get('/user', (req, res) => {
  query.getUserById(req.user.id)
    .then(user => {
      res.send({
        id: req.user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar_url
      })
    })
})

router.get('/message', (req, res) => {
  res.send('Hello SPA!')
})

module.exports = router
