import React, { useState,useEffect } from "react";
import { TbLayoutSidebarFilled } from "react-icons/tb";
import { SiPolestar } from "react-icons/si";
import { HiOutlineBars3BottomLeft } from "react-icons/hi2";
import Mainpage from './Mainpage';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import axios from "axios";
import boy from '../imgs/user.webp'
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const URL = process.env.REACT_APP_URL;

  const [isOpen, setIsOpen] = useState(false);
  const [profile,setProfile]=useState();
const [LOG, setLOG] = useState("");
  const [history, setHistory] = useState([]);
//okokokok ruk ek min   jkkg   me video bej r 
console.log("history",history)
const userId = localStorage.getItem("id");
console.log(userId); // Ye tumhe stored id return karega

useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${URL}/api/history/${userId}`);
      setHistory(response.data.reverse());
    } catch (error) {
      console.error("History fetch karne me error:", error);
    }
  };

  fetchHistory();
}, [userId]);
const dispatch=useDispatch();

const navigate=useNavigate();

  const handleLOG=()=>{
    setLOG(!LOG)
  }
  
    const TruncateText = ({ text }) => (
      <span style={{ color: "#575b5f", fontSize: "15px", fontWeight: "400" }}>
        {text.length > 24 ? text.substring(0, 24) + "..." : text}
      </span>
    );
  // user information
const headers={
  id:localStorage.getItem("id"),
  authorization:`Bearer ${localStorage.getItem("token")}`
}
useEffect(()=>{
  const fetch=async()=>{
const response=await axios.get(`${URL}/get-user-information`,{headers});
setProfile(response.data.username);
  }
  fetch();
},[])
const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn);
  return (
    <>
      <div className='d-flex position-relative containt' style={{ height: "100vh" }}>
        {/* Sidebar ko fixed width diya */}
        {isOpen &&(
                <div
                  className=" d-flex flex-column"
                  style={{ width:"320px", background: "#f0f4f9", zIndex: "1000", borderRight: "1px solid black",padding:"15px 0 0 12px" }}
                >
                 <div style={{height:"30px",width:"30px"}} className=" m-2">
                  
                 <TbLayoutSidebarFilled
                      onClick={() => setIsOpen(false)}
                      
                      className="HOVERFIRST h-100 w-100 cr"
                    />
                  
                 </div>
                  <div className="px-3">
                    <div className="d-flex gap-2 align-items-center my-4">
                      <SiPolestar style={{ color: "#3DC2EC", fontSize: "20px" }} />
                      <span style={{ fontWeight: "400" }}>ChatBOT</span>
                    </div>
                    <h1 style={{ fontWeight: "500", fontSize: "14px", color: "#1b1c1d", marginTop: "10px" }}>Recent</h1>
                  </div>
                  <div
                    className="d-flex flex-column gap-1 "
                    style={{ flexGrow: 1, paddingRight: "5px", overflowY:'scroll' }}
                  >
                   {history.filter(item => item.role === 'user').map((item, index) => (
  <div key={index}
    style={{ height: "40px", width: "250px", cursor: "pointer", padding: "10px" }}
    className="d-flex gap-2 align-items-center HOVER rounded-pill"
  >
    <HiOutlineBars3BottomLeft style={{ fontSize: "20px" }} />
    <TruncateText text={item.content} />
  </div>
))}

                  </div>
                </div>
              ) }

        {/* Ye bachi hui poori width le lega */}
        <div style={{ flexGrow: 1 }}>
        <div style={{width:'100%',height:"50px",zIndex:'1'}} className='main  position-relative'>
<div className='TopBar position-absolute w-100  d-flex align-items-center bg-white justify-content-between ' style={{height:"50px"}} >
<div className="dalju gap-2">
{
  !isOpen && (
    <div>
                  <TbLayoutSidebarFilled
                    style={{ height: "27px", width: "27px", cursor: "pointer", margin: "10px" }}
                    onClick={() => setIsOpen(true)}
                    className="HOVERFIRST"
                  />
                </div>
  )
}
  <h3 style={{fontWeight:"400",fontSize:"20px"}}>ChatBOT</h3></div>
<div className="dalju gap-2">
 {!isLoggedIn && (
   <div className="rounded-pill bg-primary p-2 cr" style={{color:"white",fontWeight:"400"}} onClick={()=>navigate("/register")}>Sign up</div>
 )}
{isLoggedIn && (
  <span className="fst-italic text-primary" style={{fontWeight:"400",fontSize:"20px"}}>{profile}</span>
)
}
{isLoggedIn && (
<img src={boy} style={{height:"35px",aspectRatio:"1",borderRadius:"50%"}} alt='img' onClick={handleLOG} className='cr'/>
)}  
</div>
 {isLoggedIn && (
   <div className='text-danger position-absolute cr' onClick={()=>
    {
      dispatch(authActions.logout());
localStorage.clear("id");
localStorage.clear("token");
navigate("/")
    }
    } style={{display:LOG?"block":"none",border:"1px solid black ",padding:"20px",borderRadius:"6px",right:"10px",background:"#e5e5e5",top:"50px",zIndex:"1"}}>Log Out
    </div>
 )}
</div>
</div>
          <Mainpage />
        </div>
      </div>
    </>
  )
}

export default Homepage
