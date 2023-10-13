const Post = require("../models/Post")

exports.newPost = async (req, res)=>{
    return res.status(200).send({mensagem: "Rota acessada!"})
}