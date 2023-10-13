const mongoose = require("mongoose")
const user = process.env.USER
const pass = process.env.PASS

const conn = ()=>{
    mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.dmdvbpu.mongodb.net/?retryWrites=true&w=majority`)

    const connect = mongoose.connection

    connect.on("open", ()=>{
        console.log("Conectado com sucesso!")
    })

    connect.on("error", (error)=>{
        console.log("Erro ao conectar: "  + error)
    })
}

conn()
module.exports = mongoose