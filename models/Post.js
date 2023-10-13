const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema({
    description:{
        type: String
    },
    src:{
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    createdAt:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("Post", PostSchema)