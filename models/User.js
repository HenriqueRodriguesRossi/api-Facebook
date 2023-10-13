const mongoose = require("mongoose")
const { StringSchema } = require("yup")

const UserSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    createdAt:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("User", UserSchema)