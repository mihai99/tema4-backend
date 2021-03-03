const db = require('../models');
const { modelName } = require('../models/book');

const getAllBooks = async(req,res) =>{
    try {
        console.log("got here")
        const books = await db.Book.find().lean().populate("author","name").exec();
        console.log("BOOKS", books)
        if (books.length == 0){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "There are no books yet!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(books))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": JSON.stringify(error)}))

    }
}
const getBookById = async(req,res) =>{
    try {
        let id = req.url.split('/')[2]
        const book = await db.Book.findById(id).populate("author","name").exec();
        console.log("BOOK", book)
        if (!book){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The book doesn't exist!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(book))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}
const postBooks = async(req,res) => {
    try {
        let bodyData = ''
        await req.on('data', function(data) {
            bodyData += data
        })
        let body = JSON.parse(bodyData)
        if (!body || !body.title || !body.description){
            res.writeHead(400, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The doesn't contain all required data!"}))
        }
        console.log (body)
        let book = await db.Book.create(body)
        if (body.author){
            let author = await db.Author.findById(body.author)
            if (author){
                author.books.push(book)
                author.save()
            } else {
                book.author = null 
                book.save()
            }
        }
        res.writeHead(201, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(book))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": JSON.stringify(error)}))

    }
}

const editBook = async(req,res) => {
    try {
        let bodyData = ''
        await req.on('data', function(data) {
            bodyData += data
        })
        let body = JSON.parse(bodyData)
        console.log("body", body)
        if (!body || (!body.title && !body.description)){
            res.writeHead(400, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The doesn't contain all required data!"}))
        }
        let id = req.url.split('/')[2]
        const book = await db.Book.findById(id);
        if (!book){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The book doesn't exist!"}))
        }
        console.log("BOOK", book)
        book.title = body.title?body.title : book.title;
        book.description = body.description?body.description : book.description;
        book.save()
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(book))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}

const deleteBookById = async(req,res) =>{
    try {
        let id = req.url.split('/')[2]
        console.log("id", id)
        const book = await db.Book.findByIdAndDelete(id);
        console.log("BOOK", book)
        if (!book){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The book doesn't exist!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"message": "Book was successfully deleted!"}))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}

module.exports = {
    getAllBooks,
    getBookById,
    postBooks,
    editBook,
    deleteBookById
}