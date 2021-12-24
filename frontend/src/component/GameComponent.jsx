import { useEffect, useState } from "react";
import isAuthenticated from "../authenticaton/authentication";
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie'
import GameBoard from '../component/GameBoard'
import '../component/gameComponent.css'
const GameComponent =  (props) =>{
    let navigate = useNavigate()
    const [classes, setClasses] = useState(["col","col","col","col","col","col","col","col","col"])
    var [socket,setSocket] = useState(props.socket)
    const [showGameboard,setShowGameBoard] = useState(true)
    const [winner,setWinner] = useState(null)
    const [onlineUsers,setOnlineUsers] = useState(null)
    async function handleGame(){
        // socket = props.socket
        // setSocket(props.socket)
        if(!props.socket)
            navigate('/home')
        props.socket.on('show board',state=>{
            // console.log('recieved event')
            setClasses(state)
        })
        props.socket.on('disconnect',(ws)=>{
            navigate('/')
        })
        props.socket.on('game over',winner=>{
            setWinner(winner)
            setShowGameBoard(false)
            socket.emit('end game')
        })
        props.socket.on('online',onlineUsers=>{
            setOnlineUsers(Object.keys(onlineUsers))
            // console.log(onlineUsers)
        })
        props.setSocket(props.socket)
    }
    useEffect(()=>{
        handleGame()
        // return ()=> socket.close()
    },[props.setSocket])

    const handleClick = (num)=>{
        props.socket.emit('play move',num)
    }
    
    return(
         <div>   
            <GameBoard handleClick={handleClick} classes={classes}/>
            {   
                !showGameboard &&
                <div className="container">
                    <h1>
                        Winner is {winner}<br/>
                        <button className="btn btn-primary" onClick={()=>navigate("/home")}>Click here to go back!</button>
                    </h1>
                </div>
            }
            <div>
                <ul>
                    {
                    onlineUsers!=null && onlineUsers.map(user=><li>{user}</li>)
                    
                    }
                </ul>
            </div>
         </div>

    )
}
export default GameComponent;