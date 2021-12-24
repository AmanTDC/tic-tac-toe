import {BACKEND_URL} from '../const/urls'
import io from 'socket.io-client';
import Cookies from 'js-cookie'

function getSocket(socket,setSocket){
    if(socket==null){
        socket = io(BACKEND_URL)
        socket.emit('send token',Cookies.get('token'))
        setSocket(socket)
    }
    return socket
}
export function setSocket(socketToSet,newSocket){
    socketToSet = newSocket
}
export default getSocket;