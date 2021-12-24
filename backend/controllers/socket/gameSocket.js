const{server} = require('../../index')
const Server = require('socket.io')
var cookie = require('cookie')
const {getUser} = require('../userController')
const {db} = require('../../config/mongodb')
const {UI_URL} = require('../../config/const')
const {getGithubData} = require('../dataController')
const io = Server(server, {
    cors: {
      origin: UI_URL,
      methods: ["GET", "POST"]
    }
  });
function areEqual(gameBoard,a,b,c){
    var concat = gameBoard[a]+gameBoard[b]+gameBoard[c]  
    return concat=='col-xcol-xcol-x' ||concat=='col-ocol-ocol-o'
}
lobby = {

}
room_number = 0
rooms = {}
userIdToRoom ={}
io.on('connection', (socket) => {
    socket.on('send token',token=>{
        getGithubData(token).then(
            response=>{
                socket.userId = response.login
                lobby[socket.userId] = socket
                if(userIdToRoom[socket.userId]){
                    socket.room_is = userIdToRoom[socket.userId]
                    socket.join(socket.room_is)
                    io.sockets.in(socket.room_is).emit('show board',rooms[cur_room].gameBoard)
                    console.log("here")
                } 
                else {
                    console.log("here2")
                    keys_lobby = Object.keys(lobby)
                    if(keys_lobby.length>1){
                        cur_room = `room${room_number++}`
                        socket.join(cur_room)
                        socket.room_is = cur_room
                        lobby[keys_lobby[0]].join(cur_room)
                        lobby[keys_lobby[0]].room_is = cur_room
                        delete lobby[socket.userId]
                        delete lobby[keys_lobby[0]]

                        //room builder function for this
                        rooms[cur_room] = {
                            gameBoard :["col","col","col","col","col","col","col","col","col"],
                            player1 : `${socket.userId}`,
                            player2 : `${keys_lobby[0]}`,
                            turn : 0,

                            move : {//Randomize this
                                [socket.userId]:'col-x',
                                [keys_lobby[0]]:'col-o'
                            }
                        }
                        userIdToRoom[rooms[cur_room].player1] = cur_room
                        userIdToRoom[rooms[cur_room].player2] = cur_room
                        io.to(cur_room).emit('show board',rooms[cur_room].gameBoard)
                    }
                }
            }
        )
        
    })
    socket.on('play move', (num) => {
        if(rooms[socket.room_is]){
            console.log(cur_room)
            console.log(socket.userId)
            cur_room = socket.room_is
            if(rooms[cur_room].gameBoard[num]==='col'){
                if((rooms[cur_room].move[socket.userId]=='col-x'&&rooms[cur_room].turn%2==0)||(rooms[cur_room].move[socket.userId]=='col-o'&&rooms[cur_room].turn%2==1)){
                    rooms[cur_room].gameBoard[num] = rooms[cur_room].move[socket.userId];
                    // console.log(rooms[cur_room].move)
                    rooms[cur_room].turn++;
                    io.sockets.in(cur_room).emit('show board',rooms[cur_room].gameBoard)
                    // console.log(rooms[cur_room].gameBoard)
                }
                //win condition or draw condition
                var gameBoard = rooms[cur_room].gameBoard
                var gameOver = areEqual(gameBoard,0,1,2)||areEqual(gameBoard,3,4,5)||areEqual(gameBoard,6,7,8)||areEqual(gameBoard,0,3,6)||
                areEqual(gameBoard,1,4,7)||areEqual(gameBoard,2,5,8)||areEqual(gameBoard,0,4,8)||areEqual(gameBoard,2,4,6)
                var draw = true
                for(i=0;i<9;i++){
                    if(gameBoard[i]=='col')
                        draw = false
                }
                if(gameOver){
                    winner = socket.userId
                    io.sockets.in(cur_room).emit('game over',winner)
                    console.log(winner)
                    delete userIdToRoom[rooms[cur_room].player1]
                    delete userIdToRoom[rooms[cur_room].player2]
                    delete rooms[cur_room]
                    //how to leave room froms oscket
                }
                else if(draw){
                    io.sockets.in(cur_room).emit('game over','No One')
                    delete userIdToRoom[rooms[cur_room].player1]
                    delete userIdToRoom[rooms[cur_room].player2]
                    delete rooms[cur_room]
                }
            }
        }
        // console.log(socket.room_is)
    });
});
console.log("Hello")
module.exports = {
    io
}