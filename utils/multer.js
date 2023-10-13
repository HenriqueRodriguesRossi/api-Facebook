const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    
    destination: function (req, res, callback){
        callback: (null, "uploads/")
    },

    filename: function (req, res, callback){
        callback: (null, Date().now + path.extname(file.originalname))
    }
})