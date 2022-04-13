var {lobby,rooms,room_number,online,userIdToRoom,userIdToSocket} = require('../models/gameModels')
const {getGithubData} = require('../controllers/dataController')
function areEqual(gameBoard,a,b,c){
    var concat = gameBoard[a]+gameBoard[b]+gameBoard[c]  
    return concat=='col-xcol-xcol-x' ||concat=='col-ocol-ocol-o'
}
//socket can be eliminated because I have userIdToSocket and io can be imported
//online might be redundant since I have created userIdToSocket which delete if socket disconnects
const createRoom = (player1,player2)=>{
    var room =  {
        roomNumber:`room${room_number++}`,
        gameBoard :["col","col","col","col","col","col","col","col","col"],
        player1 : `${player1}`,
        player2 : `${player2}`,
        turn : 0,
        move : {//Randomize this
            [player1]:'col-x',
            [player2]:'col-o'
        }
    }
    rooms[room.roomNumber] = room
    roomNumber = room.roomNumber
    s1 = userIdToSocket[player1]
    s2 = userIdToSocket[player2]
    userIdToRoom[player1] = s1.room_is = roomNumber
    userIdToRoom[player2] = s2.room_is = roomNumber
    s1.join(roomNumber)
    s2.join(roomNumber)
    return room;
}
const randomMatchup = (socket,io)=>{
    lobby[socket.userId] = socket
    keys_lobby = Object.keys(lobby)
    if(keys_lobby.length>1&&online[keys_lobby[0]]){
        player1 = socket.userId
        player2 = keys_lobby[0]
        
        room = createRoom(player1,player2)
        
        
        delete lobby[socket.userId]
        delete lobby[player2]

        io.to(room.roomNumber).emit('show board',rooms[room.roomNumber].gameBoard)
    }
}
const identifySocket = async (token,socket,io,callback)=>{
    getGithubData(token).then(response=>{
        if(!response)
            return
        socket.userId = response.login
        online[socket.userId] = true
        userIdToSocket[socket.userId] = socket
        broadcastOnlineUsers(socket.room_is,socket,io)
        console.log(userIdToRoom[socket.userId])
        console.log(socket.userId)
        callback(socket,io)
    })         
}
const assignPreState = (socket,io) =>{
    cur_room = userIdToRoom[socket.userId]
    socket.room_is = cur_room
    socket.join(socket.room_is)
    io.sockets.in(socket.room_is).emit('show board',rooms[cur_room].gameBoard)
}
const playGame = (socket,io)=>{
    if(userIdToRoom[socket.userId])
        assignPreState(socket,io)       
    else 
        randomMatchup(socket,io)
    if(userIdToRoom[socket.userId])
        broadcastOnlineUsers(socket.room_is,socket,io)
}
const deleteRoom = (roomNumber)=>{
    //check if there is a method to delete room in socket.io
    if(!rooms[roomNumber])
        return 
    player1 = rooms[roomNumber].player1
    player2 = rooms[roomNumber].player2
    s1 = userIdToSocket[player1]
    s2 = userIdToSocket[player2]
    delete s1.room_is
    delete s2.room_is
    delete userIdToRoom[player1]
    delete userIdToRoom[player2]
    delete rooms[roomNumber]
}
const endGame = (socket,io)=>{
    if(socket.room_is){
        io.sockets.in(socket.room_is).emit('end game')
        deleteRoom(socket.room_is)
    }
}
const playMove= (num,socket,io) => {
    if(rooms[socket.room_is]){
        cur_room = socket.room_is
        if(rooms[cur_room].gameBoard[num]==='col'){
            if((rooms[cur_room].move[socket.userId]=='col-x'&&rooms[cur_room].turn%2==0)||(rooms[cur_room].move[socket.userId]=='col-o'&&rooms[cur_room].turn%2==1)){
                rooms[cur_room].gameBoard[num] = rooms[cur_room].move[socket.userId];
                rooms[cur_room].turn++;
                io.sockets.in(cur_room).emit('show board',rooms[cur_room].gameBoard)
                io.sockets.in(cur_room).emit('play message','')
                // gameTimer = 0
            }
            else
                socket.emit('play message','It\'s not your turn')
            var gameBoard = rooms[cur_room].gameBoard
            var gameOver = areEqual(gameBoard,0,1,2)||areEqual(gameBoard,3,4,5)||areEqual(gameBoard,6,7,8)||areEqual(gameBoard,0,3,6)||
            areEqual(gameBoard,1,4,7)||areEqual(gameBoard,2,5,8)||areEqual(gameBoard,0,4,8)||areEqual(gameBoard,2,4,6)
            var draw = true
            for(i=0;i<9;i++){
                if(gameBoard[i]=='col')
                    draw = false
            }
            if(gameOver||draw){
                winner = socket.userId
                if(draw)
                    winner = 'None'
                io.sockets.in(cur_room).emit('game over',winner)
            }
        }
        else
            socket.emit('play message','This block is already filled')
    }
}
const disconnectSocket = (ws,socket,io)=>{
    delete online[socket.userId]
    delete userIdToSocket[socket.userId]
    broadcastOnlineUsers(socket.room_is,socket,io)
}
const broadcastOnlineUsers = (room,socket,io)=>{
    io.sockets.in(room).emit('online',online)
}
module.exports = {
    identifySocket,playGame,endGame,playMove,disconnectSocket,broadcastOnlineUsers
}