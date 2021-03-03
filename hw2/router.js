const {bookController, authorController} = require('./controllers')

const routeParser = (req,res) =>{
    console.log(req.method)
    switch (req.method) {
        case "GET":
            route = req.url.split('/')
            route.shift(0)
            console.log(route)
            switch (route[0]) {
                case '':
                    break;
                case 'books':
                    if (route.length == 1){
                        return bookController.getAllBooks(req,res)
                    } else {
                        return bookController.getBookById(req,res)
                    }
                    break;
                case 'authors':
                    if (route.length == 1){
                        return authorController.getAllAuthors(req,res);
                    } else {
                        return authorController.getAuthorById(req,res);
                    }
                    break;    
                default:
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({"error": "Route not found!"}))
            }
            
            break;
        case "POST":
            switch (req.url) {
                case '/books':
                    return bookController.postBooks(req,res);
                    break;
                case '/authors':
                    return authorController.postAuthors(req,res);
                    break;
                default:
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({"error": "Route not found!"}))
            }

            break;
        case "PUT":
            route = req.url.split('/')
            route.shift(0)
            switch (route[0]) {
                case 'books':
                    return bookController.editBook(req,res);
                    break; 
                case 'authors':
                    return authorController.editAuthor(req,res);
                default:
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({"error": "Route not found!"}))
                    break;
            }
            break;
        case "DELETE":
            route = req.url.split('/')
            route.shift(0)
            switch (route[0]) {
                case 'books':
                    return bookController.deleteBookById(req,res);
                case 'authors':
                    return authorController.deleteAuthorById(req,res); 
                default:
                    res.writeHead(404, {'Content-Type': 'text/json'})
                    return res.end(JSON.stringify({"error": "Route not found!"}))
            }
            break;
        default:
            res.writeHead(405, {'Content-Type': 'text/json'})
            return res.end(JSON.stringify({"error": "Method not accepted!"}))
            break;
    }
}
module.exports = {
    routeParser
}