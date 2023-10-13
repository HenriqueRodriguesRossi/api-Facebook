const PostsController = require("../controllers/PostController")
const checkToken = require("../utils/chechToken")
const router = require("express").Router()

router.get("/new-post", checkToken, PostsController.newPost)

module.exports = router