var mongoose=require("mongoose");

var blogSchema = mongoose.Schema({
    title:String,
    description: String,
    created:{type:Date , default : Date.now},
    author: {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Author"
    }
})
module.exports = mongoose.model("Book", blogSchema);