var express = require('express')

var http = require('http');
var cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const path = require('path');
const {UI_URL,BACKEND_URL} = require('../backend/config/const')
// const {io} = require('')
app = express()
var corsOptions = {
    origin: UI_URL,
    credentials:true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(express.urlencoded())
app.use(express.json())
app.use(cors(corsOptions))
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.static('public'))
server = http.createServer(app).listen(8000,(req,res)=>{
    console.log("Server Running Successfull at PORT 8080")
});

module.exports = {
    app , server
}