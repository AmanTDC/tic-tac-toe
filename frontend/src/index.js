import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter,Routes,Route } from "react-router-dom";
import LoginComponent from './component/LoginComponent';
import RegisterComponent from './component/RegisterComponent';
import HomeComponent from './component/HomeComponent';
import GameComponent from './component/GameComponent';
import { BACKEND_URL } from './const/urls';
import io from 'socket.io-client';
import Cookies from 'js-cookie'
import isAuthenticated from './authenticaton/authentication';
const Index = (props)=>{
  var[socket,setSocket] = useState(null)

  async function getSocket(){
    var temp = socket 
    if(socket==null){
          temp = await io(BACKEND_URL)
          await temp.emit('send token',Cookies.get('token'))
          await setSocket(temp) 
          console.log(temp)
    }
    return temp 
  }
  useEffect(()=>{
    getSocket()
  })
  return(
    
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/register" element={<RegisterComponent/>} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/home" element={<HomeComponent socket={socket} getSocket={getSocket} setSocket={setSocket}/>} />
          <Route path="/game" element={<GameComponent socket={socket} getSocket={getSocket} setSocket={setSocket}/>} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  )
}
ReactDOM.render(<Index/>,document.getElementById('root'))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
