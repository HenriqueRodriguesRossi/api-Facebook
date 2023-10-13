const router = require("express").Router()
const UserController = require("../controllers/UserController")

router.post("/new-user", UserController.newUser)
router.post("/login", UserController.login)

module.exports = router