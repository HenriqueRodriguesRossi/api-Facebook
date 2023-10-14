const router = require("express").Router()
const UserController = require("../controllers/UserController")
const checkToken = require("../utils/checkToken")

router.post("/new-user", UserController.newUser)
router.post("/login", UserController.login)
router.get("/find-user", checkToken, UserController.findUser)

module.exports = router