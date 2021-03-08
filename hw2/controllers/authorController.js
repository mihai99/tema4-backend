const db = require('../models');
const { modelName } = require('../models/author');
const mongoose = require('mongoose');

const getAllAuthors = async(req,res) =>{
    try {
        const authors = await db.Author.find().populate({
            path: 'books',
            select: "name",
            model: 'Book',
          }).exec();
        if (authors.length == 0){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "There are no authors yet!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(authors))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": JSON.stringify(error)}))

    }
}
const getAuthorById = async(req,res) =>{
    try {
        let id = req.url.split('/')[2]
        if (!mongoose.Types.ObjectId.isValid(id)){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "Invalid id provided"}))
        }
        const author = await db.Author.findById(id).populate("books").exec();
        if (!author){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The author doesn't exist!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(author))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}
const postAuthors = async(req,res) => {
    try {
        let bodyData = ''
        await req.on('data', function(data) {
            bodyData += data
        })
        let body = JSON.parse(bodyData)
        if (!body || !body.name || !body.biography){
            res.writeHead(400, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The request doesn't contain all required data!"}))
        }
        let author = await db.Author.create(body)
        res.writeHead(201, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(author))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": JSON.stringify(error)}))

    }
}

const editAuthor = async(req,res) => {
    try {
        let bodyData = ''
        await req.on('data', function(data) {
            bodyData += data
        })
        let body = JSON.parse(bodyData)
        console.log("body", body)
        if (!body || (!body.name && !body.biography)){
            res.writeHead(400, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The request doesn't contain all required data!"}))
        }
        let id = req.url.split('/')[2]
        if (!mongoose.Types.ObjectId.isValid(id)){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "Invalid id provided"}))
        }
        const author = await db.Author.findById(id);
        if (!author){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The author doesn't exist!"}))
        }
        author.name = body.name?body.name : author.name;
        author.biography = body.biography?body.biography : author.biography;
        author.save()
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify(author))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}

const deleteAuthorById = async(req,res) =>{
    try {
        let id = req.url.split('/')[2]
        if (!mongoose.Types.ObjectId.isValid(id)){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "Invalid id provided"}))
        }
        const author = await db.Author.findByIdAndDelete(id);
        if (!author){
            res.writeHead(404, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({message: "The author doesn't exist!"}))
        }
        res.writeHead(200, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"message": "Author was successfully deleted!"}))

    } catch (error) {
        res.writeHead(500, {'Content-Type': 'text/json'})
        return res.end(JSON.stringify({"error": error}))

    }
}

module.exports = {
    getAllAuthors,
    getAuthorById,
    postAuthors,
    editAuthor,
    deleteAuthorById
}