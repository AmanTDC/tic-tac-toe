const{server} = require('../index')
const Server = require('socket.io')
var cookie = require('cookie')
const {getUser} = require('../controllers/userController')
const {db} = require('../config/mongodb')
const {UI_URL} = require('../config/const')
const {getGithubData} = require('../controllers/dataController')
const {playGame,identifySocket,endGame,playMove,disconnectSocket,broadcastOnlineUsers} = require('../controllers/gameController')
var {lobby,rooms,room_number,online,userIdToRoom} = require('../models/gameModels')

const io = Server(server, {
    cors: {
      origin: UI_URL,
      methods: ["GET", "POST"]
    }
});


io.on('connection', async (socket) => {
    socket.on('send token',(token)=>identifySocket(token,socket,io,function(){}))
    socket.on('play game',(token)=>identifySocket(token,socket,io,playGame))
    socket.on('disconnect',(ws)=>disconnectSocket(ws,socket,io))
    socket.on('play move',(num)=> playMove(num,socket,io));
    socket.on('end game',()=>endGame(socket,io))
    socket.on('show online',()=>broadcastOnlineUsers(socket.room_is,socket,io))
});
module.exports = {
    io
}