const PostsController = require("../controllers/PostController")
const checkToken = require("../utils/checkToken");
const router = require("express").Router()
const upload = require("../utils/multer")

router.post("/new-post", checkToken, upload.single("src"), PostsController.newPost)
router.get("/find-post",checkToken,  PostsController.searchPosts)
router.delete("/delete-post/:id", checkToken,  PostsController.deletePost)

module.exports = router