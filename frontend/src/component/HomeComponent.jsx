import { useEffect } from "react";
import isAuthenticated from "../authenticaton/authentication";
import {useNavigate} from 'react-router-dom';
import Cookies from "js-cookie";
const HomeComponent =  (props) =>{
    let navigate = useNavigate()
    useEffect( ()=>{
        //make a function of it
        props.getSocket()
        isAuthenticated().then(res=>{
            if(!res.isValidUser)
                navigate(res.redirect)
        }) 
    })
    function startGame(){
        // console.log(Cookies.get('token'))
        props.socket.emit('play game',Cookies.get('token'))
        navigate('/game')
    }
    return(
        <div>
            <button className="btn btn-primary" onClick={startGame}>Play!</button>
        </div>
    )
}
export default HomeComponent;