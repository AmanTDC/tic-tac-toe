import { useEffect } from "react";
import isAuthenticated from "../authenticaton/authentication";
import {useNavigate} from 'react-router-dom';
const HomeComponent =  (props) =>{
    let navigate = useNavigate()
    useEffect( ()=>{
        //make a function of it
        isAuthenticated().then(res=>{
            if(!res.isValidUser)
                navigate(res.redirect)
        }) 
    })
    return(
        <div>
            <button className="btn btn-primary" onClick={()=>navigate('/game')}>Play!</button>
        </div>
    )
}
export default HomeComponent;