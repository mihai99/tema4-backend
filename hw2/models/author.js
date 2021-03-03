var mongoose=require("mongoose");

var blogSchema = mongoose.Schema({
    name:String,
    biography: String,
    created:{type:Date , default : Date.now},
    books : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Book"
        }
    ],
})
module.exports = mongoose.model("Author", blogSchema);