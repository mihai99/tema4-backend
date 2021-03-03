const http = require('http')
const querystring = require('querystring');

// const pages = require('./client/clientPages')
require('dotenv').config();
const mongoose = require('mongoose');
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("connected successfully to db"));

let router = require('./router')


const server = http.createServer(function(request, response) {
    console.dir(request.param)
    return router.routeParser(request, response);
})

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
