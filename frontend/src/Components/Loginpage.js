
import React, { useState, useEffect } from "react";
import google from '../imgs/google.png'
import { PiEyeLight, PiEyeSlash } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from 'axios';
import {authActions} from "../store/auth"
import { useDispatch } from "react-redux";
import {  toast } from "react-toastify";
import photo from "../imgs/photo.jpeg"

export default function Loginpage() {
 const navigate=useNavigate();
const dispatch=useDispatch();

  const [Show, setShow] = useState(true);
  const handleShow = () => {
    setShow(!Show);
  };

  const [values,setValues]=useState({
    username:"",
    password:"",
  })
const change=(e)=>{
  const {name,value}=e.target;
  setValues({...values,[name]:value})
}
const submit = async (e) => {
  e.preventDefault(); // Form ka default behavior rokna

  console.log("Clicked");

  try {
    if (!values.username  || !values.password ) {
      toast.success("All fields are required");
      return;
    }

    const response = await axios.post("https://a-ichatbot-nine.vercel.app/signin", values);
    dispatch(authActions.login());
    
localStorage.setItem("id",response.data.id)
localStorage.setItem("token",response.data.token)
toast.success("Login Successfull")
navigate("/")
console.log(response.data)
  } catch (err) {
    console.log("Error:", err.response.data.message);
  }
};
   
  return (
    <>
      <div
        className="login_main position-relative d-flex  justify-content-center flex-row  w-100"
        style={{ height: "100vh",width:"100%"}}
      >
       
   
     
        <div className="Login_concept dalju  flex-column  p-3 ">
          
          <h1 style={{ fontFamily: "n", fontWeight: "700" }}>Hello,friend!</h1>
          <p style={{ color: "#cad2c5" }}>
            Plese <span>login</span> to your account
          </p>

          {/* form form form */}
          <form
            className="position-relative d-flex  align-items-center flex-column w-100"
            style={{ gap: "9px", marginTop: "30px" }}
           onSubmit={submit}
          >
            <div className="username position-relative  mt-2">
              <FaUser style={{
                position:"absolute",
                left:"8px",
                top:"12px",
                fontSize:"22px",
                color:"#3DC2EC"
              }}/>
              <input
                className="inputt "
                type="username"
                name="username"
                value={values.username}
                onChange={change}
              
                required
              />
              <label className="Lable ms-3" htmlFor="username">
               Enter your username
              </label>
            </div>

            <div className="password position-relative  mt-2">
            <RiLockPasswordFill style={{
                position:"absolute",
                left:"8px",
                top:"12px",
                fontSize:"22px",
                color:"#3DC2EC"
              }}/>
              <input
                className="inputt"
                type={Show ? "password" : "text"}
                name="password"
                value={values.password}
                onChange={change}
                required
                /* minLength={6} */
              />

              <label className="Lable ms-3" htmlFor="password">
                Password
              </label>
              {Show ? (
                <PiEyeSlash
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "17px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={handleShow}
                />
              ) : (
                <PiEyeLight
                  style={{
                    position: "absolute",
                    right: "20px",
                    top: "17px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                  onClick={handleShow}
                />
              )}
            </div>

            
            
            <button type="submit" className="btnnn">
              Log In
            </button>
          </form>
          <div className="dalju mt-3 w-100">
            <div
              style={{
                height: "2px",
                backgroundColor: "#e8e3e3",
                width: "90px",
              }}
            ></div>
            <div style={{ color: "#c2c1c1", padding: "10px" }}>
              or Login with
            </div>
            <div
              style={{
                height: "2px",
                backgroundColor: "#e8e3e3",
                width: "90px",
              }}
            ></div>
          </div>

          <button
        
            style={{
              border: "2px solid #c2c1c1",
              borderRadius: "10px",
              padding: "10px 30px",
              gap: "10px",
              cursor: "pointer",
            }}
            className="dalju  "
          >
            <img src={google} alt="google_img" style={{ width: "19px" }} />
            <h6 className="p-0 m-0">Google</h6>
          </button>
         
            
            <p className="mt-4">
              Don't have a account?{" "}
              <span
                style={{
                  cursor: "pointer",
                  color: "#3DC2EC",
                  borderBottom: "1px solid #3DC2EC",
                }}
                onClick={() =>navigate("/Register")}
              >
                Sing up
              </span>
            </p>
         
        </div>
        
        <img src={photo} style={{height:"100%",width:'50%'}} alt="img" className=' img-fluid Login_img '/>
      </div>
    </>
  );
}



