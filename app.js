const express = require("express")
const app = express()
require("dotenv").config()
require("./database/connect")
const cors = require("cors")
const bodyParser = require("body-parser")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

const UserRouter = require("./controllers/UserController")
app.use(UserRouter)

const PostsRouter = require("./controllers/PostController")
app.use(PostsRouter)

app.listen(8080, ()=>{
    console.log("Servidor rodando na porta 8080!")
})