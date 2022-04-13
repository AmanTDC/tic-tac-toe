import { useEffect } from "react";
import isAuthenticated from "../authenticaton/authentication";
import { useNavigate } from "react-router";
import {BACKEND_URL} from '../const/urls';
import '../stylesheets/login.css'
const LoginComponent = (props)=>{
    let navigate = useNavigate()
    useEffect(()=>{
        //functionize it
        isAuthenticated().then(res=>{
            if(res.isValidUser)
                navigate('/home')
        })
    })
    return (
        <div className="container vertical-center">
            
            <div className="row">
                <img alt="logo" className="logo" src="/tictactoe.png"/>
            </div> 
            <div>   
                <div className="message">
                    <h1>
                        Welcome to Tic-Tac-Toe<br/>
                    </h1>
                    <h2>
                        Click <a href = {`https://github.com/login/oauth/authorize?client_id=cb3e17851e9b0f95ce83&redirect_uri=${BACKEND_URL}/oauth/github`} >Here</a> to authorize yourself.
                    </h2>
                </div>
            </div>

        </div>
    )
}
export default LoginComponent;