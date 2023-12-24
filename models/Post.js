const mongoose = require("mongoose")
const Schema = mongoose.Schema

const PostSchema = new mongoose.Schema({
    author : {type:  Schema.Types.ObjectId, ref:"users", null:true,},

    title : {type: String, required:true},
    content : {type: String, required:true},
    date : {type: Date, default: Date.now},
    category : {type:  Schema.Types.ObjectId, ref:"categories", null:true,},

    post_image : {type: String, required:true},

})

module.exports = mongoose.model("Post", PostSchema)