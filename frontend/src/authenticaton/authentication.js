import axios from "axios";
import {BACKEND_URL} from '../const/urls'
async function isAuthenticated(){
    var data = await axios.get(BACKEND_URL+'/isValidUser',{withCredentials:true})
    return data.data
}

export default isAuthenticated;