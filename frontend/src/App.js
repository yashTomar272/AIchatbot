
import "bootstrap/dist/css/bootstrap.css";
 import "bootstrap/dist/js/bootstrap.bundle.js";
import Loginpage from "./Components/Loginpage";
import "./App.css"
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Registerpage from "./Components/Registerpage";
import Homepage from "./Components/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import {authActions} from "./store/auth"
 import React, { useEffect } from "react";
 
const App = () => {
  const dispatch=useDispatch();
 useEffect(()=>{
 if(localStorage.getItem("id") && 
 localStorage.getItem("token")
){
dispatch(authActions.login())
}
 },[])
  return (
    <>
       <ToastContainer position="top-right" autoClose={2000} />
<Routes>
<Route  path="/" element={ <Homepage/>} />
<Route  path="/Register" element={ <Registerpage/>} />
<Route  path="/Login" element={ <Loginpage/>} />

</Routes>

    </>
  );
};

export default App; 