import React, { useEffect, useState } from 'react'
import Login from '../components/authentication/Login';
import Signup from '../components/authentication/Signup';
import wall from '../images/wall.jpg';
import { Route, Routes, useNavigate } from 'react-router-dom';


const Home = () => {
  const [check,setCheck]=useState(true);
 
  const navigate=useNavigate()
  useEffect(() => {
     const  user  = JSON.parse(localStorage.getItem("userInfo")); 
    if(user)  navigate('/games')
    
  },[])
  return (
    <div
      className=" bg-cover bg-center"
      style={{ backgroundImage: `url(${wall})` }}
    >
      {
        check? <Login setCheck={setCheck} /> : <Signup setCheck={setCheck} />
      }
      
    </div>
  );
  
}

export default Home
