import React, { useState, useEffect, useRef} from "react";
import axios from "axios";
import { BsEmojiSmile } from "react-icons/bs";
import { TiAttachmentOutline } from "react-icons/ti";
import { GrSend } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';

import Sidebar from "./Sidebar";


const Mainpage = () => {
  

const [profile,setProfile]=useState();
const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSend = () => {
    if (message.trim() !== "") {
      handleSendMessage(message);
      setMessage("");
    }
  };
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Runs whenever messages update

  const handleSendMessage = async (userMessage) => {
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    
    const botResponse = await fetchResponse(userMessage);
    setLoading(false);
    
    let index = 0;
    let streamedMessage = "";
  
    // Pehle assistant ka ek empty message add karna zaroori hai taaki state update sahi ho
    setMessages(prevMessages => [...prevMessages, { role: "assistant", content: "" }]);
  
    const interval = setInterval(() => {
      if (index < botResponse.length) {
        streamedMessage += botResponse[index];
  
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          
          // Assistant ka last message update kare bina purane ko hataye
          const lastIndex = updatedMessages.length - 1;
          if (updatedMessages[lastIndex].role === "assistant") {
            updatedMessages[lastIndex] = { role: "assistant", content: streamedMessage };
          }
  
          return updatedMessages;
        });
  
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30); // Har 50ms me ek ek letter add hoga
  };
    

  const chatHistory = []; // Context Store करने के लिए

  const fetchResponse = async (userMessage) => {
    try {
        const userId = localStorage.getItem("id"); // localStorage से userId लो

        chatHistory.push({ role: "user", content: userMessage }); // History में Add करो

        const response = await axios.post("https://a-ichatbot-nine.vercel.app/api/chat", {
            userId: userId, // 🔥 userId को body में भेजो
            message: userMessage,
            history: chatHistory, // पुराना डाटा भेजो
        });

        const botMessage = response.data.response;
        chatHistory.push({ role: "assistant", content: botMessage }); // Bot के Message को भी Store करो

        return botMessage;
    } catch (error) {
        console.error("Error fetching response:", error.response?.data || error);
        return "Server error. Please try again later  .";
    }
};


  
// user information
const headers={
  id:localStorage.getItem("id"),
  authorization:`Bearer ${localStorage.getItem("token")}`
}
useEffect(() => {
  const fetch = async () => {
    const response = await axios.get("https://a-ichatbot-nine.vercel.app/get-user-information", { headers });
    setProfile(response.data.username);
  };
  fetch();
}, []);

const [copiedIndex, setCopiedIndex] = useState(null);

const handleCopy = (text, index) => {
  navigator.clipboard.writeText(text);
  setCopiedIndex(index);

  // 2 second ke baad copied text hata dega
  setTimeout(() => setCopiedIndex(null), 2000);
};

const isLoggedIn=useSelector((state)=>state.auth.isLoggedIn);

  return (
   <> 
   <div className='' style={{height:"92vh",width:"100%"}}>



{/* bottom */}
{/* <div className='certer_main w-100 position-relative px-lg-5 px-md-4 px-sm-1  d-flex  flex-column mt-5 gap-3' style={{zIndex:"0",height:"80%", border:'2px solid', bottom:'50px'}}> */}
<div className="chat-window p-2" style={{height:"calc(100% - 120px)", overflowY:"scroll"}} >
  
 {messages.length===0 &&
  <div className="w-100 h-100 dalju">
    {!isLoggedIn && 
  <h1 className="fst-italic text-primary">hello users...</h1>

    }
{isLoggedIn &&
  <h1 className="fst-italic text-primary">hello {profile}</h1>
}
</div>
 }
    {messages.map((msg, index) => {
        // **Properly Detect Code Blocks** (Sirf code detect karega)
        const regex = /```([\w]*)\n([\s\S]*?)```/g;
        let parts = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(msg.content)) !== null) {
          if (match.index > lastIndex) {
            parts.push({ type: "text", content: msg.content.slice(lastIndex, match.index) });
          }
          parts.push({ type: "code", content: match[2].trim() });
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < msg.content.length) {
          parts.push({ type: "text", content: msg.content.slice(lastIndex) });
        }

        return (
          <div key={index} className={`message_bubble_first ${msg.role === "user" ? "user" : "bot"}`} ref={chatEndRef}>
            <div className={`message_bubble_second ${msg.role === "user" ? "user" : "bot"}`}>
              {parts.map((part, i) =>
                part.type === "code" ? (
                  <div key={i} style={{ position: "relative", marginBottom: "10px" }}>
                    <pre style={{ background: "#f4f4f4",  borderRadius: "5px", overflowX: "auto" }} className="pre_code">
                      <code >{part.content}</code>
                    </pre>
                    <button
                      onClick={() => handleCopy(part.content, `${index}-${i}`)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: copiedIndex === `${index}-${i}` ? "#4CAF50" : "#3DC2EC",
                        color: "white",
                        border: "none",
                        padding: "5px",
                        borderRadius: "3px",
                        cursor: "pointer",
                      }}
                    >
                      {copiedIndex === `${index}-${i}` ? "Copied!" : "Copy"}
                    </button>
                  </div>
                ) : (
                  <p key={i} className="m-1">{part.content}</p> // Normal text
                )
              )}
             
            </div>
          </div>
        );
      })}
       {loading && (
    <div class="three-body">
    <div class="three-body__dot"></div>
    <div class="three-body__dot"></div>
    <div class="three-body__dot"></div>
    </div>
  )}
</div>

{/* </div> */}
  {/* bottom */}
<div className='position-relative' style={{height:"53px", bottom:'0px'}}>
<div  className='inputText position- dalju gap-2  '>
<div style={{padding:"10px",border:"1px solid #c4c7c5"}} className='bg-white dalju rounded-pill INPUT'>
    <button style={{border:"none",background:"none"}}><BsEmojiSmile className='fs-4'/></button>
    <input  
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..." style={{border:"none",background:"none",outline:"none",height:"30px",resize:"none"}} className='w-100'/>
    <button style={{border:"none",background:"none"}}><TiAttachmentOutline className='fs-4'/></button>
</div>
<button onClick={handleSend}  style={{height:"45px",aspectRatio:"1",borderRadius:"50%",border:"none",background:"#3DC2EC"}} className='dalju ' ><GrSend className='fs-4' /></button>
</div></div>
    </div>
   </>
  )
}

export default Mainpage;

