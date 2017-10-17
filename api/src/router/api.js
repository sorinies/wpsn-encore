const express = require('express')
const expressJwt = require('express-jwt')
const bodyParser = require('body-parser')
const cors = require('cors')
const axios = require('axios')

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

// Myfeed 가져오기
router.get('/feed', (req, res) => {
  const user_id = req.user.id
  query.getFeedByUserId(user_id)
    .then(feed => {
      res.send(feed)
    })
})

// 전체 게시물 가져오기
router.get('/post', (req, res) => {
  query.getWholePost()
    .then(post => {
      res.send(post)
  })
})

// 특정 사용자가 작성한 게시물 전체 가져오기
router.get('/user/:id/post', (req, res) => {
  const user_id = req.params.id
  query.getPostByUserId(user_id)
    .then(post => {
      res.send(post)
  })
})

// 게시물 & 코멘트 가져오기
router.get('/post/:id', (req, res) => {
  query.getPostById(req.params.id).then(post => {
    query.getCommentByPostId(req.params.id).then(comment => {
      res.send({post, comment})
    })
  })
})

// 코멘트만 가져오기
router.get('/post/:id/comment', (req, res) => {
  query.getCommentByPostId(req.params.id).then(comment => {
    res.send(comment)
  })
})

// 게시물 작성
router.post('/post', (req, res) => {
  const user_id = req.user.id
  const {
    picture_small, picture_big, preview, article,
    album, track, artist, geo_x, geo_y, address, like_count } = req.body
  query.createPost({
    user_id, picture_small, picture_big, preview, article,
    album, track, artist, geo_x, geo_y, address, like_count})
    .then((post) => {
      res.status(201)
      res.send(post)
    })
})

// 게시물 수정
router.patch('/post/:id', (req, res) => {
  const id = req.params.id
  const user_id = req.user.id
  const article = req.body.article
  query.getPostById(id)
    .then(() => {
      query.updatePostById(id, article)
        .then(id => {
          return query.getPostById(id)
        })
        .then(post => {
          res.send(post)
        })
    })
    .catch(next)
})

// 게시물 삭제
router.delete('/post/:id', (req, res) => {
  query.getPostById(req.params.id).then(() => {
    query.detelePostById(id).then(() => res.end())
  }).catch(next)
})

// 코멘트 작성
router.post('/post/:id/comment', (req, res) => {
  const target_id = req.params.id
  const username = 'testman'
  const comment = "ah ah mic test"
  const user_id = 1 // req.user.id
  query.createCommentByPostId(user_id, username, target_id, comment)
})

// 특정 유저가 좋아요한 게시물
router.get('/user/:id/liked', (req, res) => {
  query.getLikedByUserId(req.params.id).then(post => {
    res.send(post)
  })
})

// 좋아요 등록
router.post('/post/:id/like', (req, res) => {
  query.createLikeById(req.params.id)
})

// 좋아요 해제
router.delete('/post/:id/like', (req, res) => {
  query.deleteLikeById(req.user.id, req.params.id)
})

// Get Music Info
router.get('/music/:keyword', (req, res) => {
  const keyword = req.params.keyword
  axios.get(`https://api.deezer.com/search?q=${keyword}`)
    .then(result => {
      res.send(result.data)
    })
})

router.get('/music/artist/:keyword', (req, res) => {
  const keyword = req.params.keyword
  axios.get(`https://api.deezer.com/search/artist/autocomplete?limit=1&q=${keyword}`)
    .then(result => {
      const {tracklist} = result.data.data[0]
      axios.get(tracklist)
        .then(result => {
          console.log(result.data)
        })
    })
})

router.get('/music/album/:keyword', (req, res) => {

})

router.get('/music/track/:keyword', (req, res) => {

})

module.exports = router
