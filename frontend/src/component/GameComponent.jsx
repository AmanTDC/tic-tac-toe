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
    const [showGameboard,setShowGameBoard] = useState(false)
    const [showWinner,setShowWinner] = useState(false)
    const [winner,setWinner] = useState('No One')
    const [onlineUsers,setOnlineUsers] = useState(null)
    const [playMessage,setPlayMessage] = useState('')
    function endGame(){
        props.socket.emit('end game')
    }
    async function handleGame(){
        if(!props.socket)
            navigate('/home')
        props.socket.on('show board',state=>{
            setShowGameBoard(true)
            setClasses(state)
        })
        props.socket.on('end game',()=>{
            setShowWinner(true)
        })
        props.socket.on('disconnect',(ws)=>{
            navigate('/')
        })
        props.socket.on('game over',winner=>{
            setWinner(winner)
            props.socket.emit('end game')
        })
        props.socket.on('online',onlineUsers=>{
            setOnlineUsers(Object.keys(onlineUsers))
            // console.log(onlineUsers)
        })
        props.socket.on('play message',message=>{
            setPlayMessage(message)
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
            { showGameboard ? <GameBoard handleClick={handleClick} endGame={endGame} classes={classes}/> : 
                    <div>
                        <h2>Waiting for Your Opponent... :-) </h2>
                    </div>
            }
            {   
                showWinner &&
                <div className="container">
                    <h1>
                        Winner is {winner}<br/>
                        <button 
                            className="btn btn-primary" 
                            onClick={()=>navigate("/home")}
                        >
                            Click here to go back!
                        </button>
                    </h1>
                </div>
            }
            <div>
                <em>
                    {playMessage}
                </em>
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