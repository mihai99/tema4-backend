const http = require('http')
const querystring = require('querystring');
const Twitter = require('twitter');
const axios = require('axios')
const pages = require('./client/clientPages')
const utils = require('./utils');
const { resolve } = require('path');
require('dotenv').config();
const {performance} = require('perf_hooks');
const { isNumber } = require('util');

const URLS = {
    OMDB : 'http://www.omdbapi.com/?i=tt3896198&apikey=',
    GIFY: `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIFY}&limit=1`
}

const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

let statusCodes200 = 0
let statusCodeError = 0
let middleTime = 0
let totalNumberOfRequests = 0
let concurentNrOfRequests = 0

const server = http.createServer(function(request, response) {
  console.dir(request.param)

  if (request.method == 'POST') {
    console.log('POST', request.url)
    var body = ''
    request.on('data', function(data) {
      body += data
    })
    request.on('end', async function() {
      console.log('Body: ' + body)
      let resp = ''
      switch (request.url) {
          case '/request':
                //parse response from form
                concurentNrOfRequests++;
                totalNumberOfRequests+=3;
                let parsed = querystring.parse(body)
                let {title} = parsed

                //construct request for omdb
                let querrySearch = ''
                if (title){
                    querrySearch = '&t='+title
                }
                let omdbUrl = URLS.OMDB + process.env.OMDB_KEY+ querrySearch
                let requestOMDB = {
                    id: utils.requestStack.length,
                    service: 'OMdb',
                    request: omdbUrl,
                    response: {},
                    time: 0,
                    status: 'Running'
                }
                //push request in stack
                utils.requestStack.push(requestOMDB)
                //construct request for tweeter
                let tweeterUrl = 'search/tweets'
                let requestTweeter = {
                    id: utils.requestStack.length,
                    service: 'Twitter',
                    request: tweeterUrl,
                    response: {},
                    status: 'Running',
                    time: 0,
                }
                //push request for tweeter
                utils.requestStack.push(requestTweeter)
                console.log("done with parsing requests")
                let searchTerm = ''
                try {
                    //await for both responses

                    let startTime = performance.now()
                    let omdbResult = await axios.get(omdbUrl);
                    statusCodes200++
                    let omdbTime = performance.now() - startTime
                    middleTime+=omdbTime
                    startTime = performance.now()
                    let tweeterResult = await client.get(tweeterUrl, {q: title, count: 1})
                    let tweeterTime = performance.now() - startTime
                    // let [omdbResult, tweeterResult] = await Promise.all([axios.get({url:omdbUrl, time: true}),client.get(tweeterUrl, {q: title, count: 1})]);
                    // console.log('OMDB', omdbResult)
                    // console.log('TWEETER', tweeterResult)

                    //update all request as done
                    let index = utils.requestStack.findIndex(r => r.id === requestOMDB.id)
                    if (index>=0){
                        utils.requestStack[index].status = 'Done'
                        utils.requestStack[index].time = omdbTime
                        utils.requestStack[index].response = JSON.stringify(omdbResult.data)
                    }
                    statusCodes200++
                    middleTime+=tweeterTime
                    index = utils.requestStack.findIndex(r => r.id === requestTweeter.id)
                    if (index>=0){
                        utils.requestStack[index].status = 'Done'
                        utils.requestStack[index].time = tweeterTime
                        utils.requestStack[index].response = JSON.stringify(tweeterResult)
                    }
                    if (omdbResult.data && omdbResult.data.Title){
                        searchTerm+= omdbResult.data.Title.split(' ')[0] || ''
                    }
                    if (tweeterResult && tweeterResult.statuses && tweeterResult.statuses[0]){
                        text = tweeterResult.statuses[0].text.split(' ')
                        searchTerm+= ' '+text[text.length -2 ]
                    }
                    
                } catch (error) {
                    statusCodeError+=1
                    console.error(error)
                }
                //start third request to words api
                let gifyURL = URLS.GIFY
                if( searchTerm){
                    gifyURL +=`&q=${encodeURIComponent(searchTerm)}`
                }
                let requestGiphy = {
                    id: utils.requestStack.length,
                    service: 'Giphy',
                    request: gifyURL,
                    response: {},
                    time: 0,
                    status: 'Running'
                }
                //push request for words
                utils.requestStack.push(requestGiphy)
                //get info about the combined word
                let gifUrl = ''
                try {
                    let startTime = performance.now()
                    let resp = await axios.get(gifyURL);
                    let gifyTime = performance.now()- startTime
                    middleTime+=gifyTime
                    let index = utils.requestStack.findIndex(r => r.id === requestGiphy.id)
                    if (index>=0){
                        utils.requestStack[index].status = 'Done'
                        utils.requestStack[index].time = gifyTime
                        utils.requestStack[index].resp = JSON.stringify(resp.data)
                    }
                    if (resp.data.data.length && resp.data.data[0] &&  resp.data.data[0].images){
                        gifUrl = resp.data.data[0].images.original.url
                    }  
                    statusCodes200++
                } catch (error) {
                    statusCodeError+=1
                    console.error(error)
                }     
                response.writeHead(200, {'Content-Type': 'text/html'})
                concurentNrOfRequests--
                if (gifUrl){
                    response.end(`<HTML>
                    <HEAD> <TITLE>Activity - Insert animated GIF to HTML</TITLE> </HEAD>
                    <BODY>
                        <h1>${searchTerm} </h1>
                        <IMG SRC="${gifUrl}">
                    </BODY>
                    </HTML>`)
                } else {
                    response.end(`No gif found with the text ${searchTerm}`)
                }
            break;
          default:
              break;
        }
      
    })
  } else {
    console.log('GET', request.url)
    let html = ''
    switch (request.url) {
        case '/':
            html = pages.header+ pages.index+pages.footer
            break;
        case '/metrics':
            html = pages.header
            let runningWebServices = utils.requestStack.filter(r => r.status === 'Running').length 
            let nav =  `<div class="card cardShow mt-4 mb-4">
                            <div class="card-body">
                                <h2 class="card-title">Metrics</h2>
                                <p>Running web services:${runningWebServices || 0} </p>
                                <p>Concurent number of requests: ${concurentNrOfRequests}</p>
                                <p>Total number of requests: ${totalNumberOfRequests} </p>
                                <p>Status code 200: ${statusCodes200} </p>
                                <p>Status code error: ${statusCodeError}</p>
                                <p>Time: ${middleTime/totalNumberOfRequests || 0} </p>
                            </div>          
                        </div>`
            let table = `<table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Service</th>
                <th scope="col">Request</th>
                <th scope="col">Response</th>
                <th scope="col">Time</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
            ${utils.requestStack.map(r=>{
                let req = `<tr>
                <th scope="row">${r.id}</th>
                <td>${r.service}</td>
                <td><div class='bigData'>${r.request}</div></td>
                <td><div class='bigData'>${JSON.stringify(r.response)}</div></td>
                <td>${r.time} </td>
                <td>${r.status} </td>
              </tr>
                `
                return req
            })

            }       
            </tbody>
          </table>`
            let body = `<div class="container">${nav} <div><h2>Logs:</h2> ${table}</div> </div>`

            html+=body + pages.footer
        default:
            break;
    }
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end(html)
  }
})

const port = 3000
const host = '127.0.0.1'
server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)
