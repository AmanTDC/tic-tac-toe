import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import isAuthenticated from "../authenticaton/authentication";
import {BACKEND_URL} from '../const/urls'
const RegisterComponent = (props)=>{
    let navigate = useNavigate()
    useEffect(()=>{

        //make a function of it
        isAuthenticated().then(res=>{
            if(!res.isValidUser&&res.redirect!==window.location.pathname)
                navigate('/')
            else if(res.isValidUser)
                navigate('/home')
                
        })
    })
    const [username,setUserName] = useState('');
    
    const handleChange =(e)=>{
        setUserName(e.target.value)
    }
    const handleClick = (e)=>{
        axios.post(BACKEND_URL+"/newUser",{
            requestType:"newUser",
            userId:username
        },{withCredentials:true})
    }
    return(
    <div className="container">
        <input onChange={handleChange} value={username}></input>
        <button onClick={handleClick} className="btn btn-danger">Hey Click me</button>
    </div>
    )
}
export default RegisterComponent;