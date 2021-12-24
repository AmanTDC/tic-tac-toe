import { useEffect, useState } from "react";
import isAuthenticated from "../authenticaton/authentication";
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie'
import '../component/gameComponent.css'
import io from 'socket.io-client';
import GameBoard from "./GameBoard";
import {BACKEND_URL} from '../const/urls'
const GameComponent =  (props) =>{
    let navigate = useNavigate()
    const [classes, setClasses] = useState(["col","col","col","col","col","col","col","col","col"])
    const [socket,setSocket] = useState(null)
    const [showGameboard,setShowGameBoard] = useState(true)
    const [winner,setWinner] = useState(null)
    useEffect( ()=>{
        isAuthenticated().then(res=>{
            if(!res.isValidUser)
                navigate('/')
        })
        var socketI = io(BACKEND_URL)
        socketI.emit('send token',Cookies.get('token'))
        console.log(socketI)
        
        socketI.on('show board',state=>{
            console.log('recieved event')
            setClasses(state)
        })
        socketI.on('disconnect',(ws)=>{
            navigate('/')
        })
        socketI.on('game over',winner=>{
            setWinner(winner)
            setShowGameBoard(false)
        })
        setSocket(socketI)
        
        return ()=>socketI.close()
    },[setSocket])

    const handleClick = (num)=>{
        socket.emit('play move',num)
    }
    
    return(
            
        showGameboard ?
         <GameBoard handleClick={handleClick} classes={classes}/> :
         <div className="container">
            <h1>
                Winner is {winner}<br/>
                <button className="btn btn-primary" onClick={()=>navigate("/home")}>Click here to go back!</button>
            </h1>
         </div>

    )
}
export default GameComponent;