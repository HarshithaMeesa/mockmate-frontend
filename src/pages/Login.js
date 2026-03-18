import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  return (

    <div style={{textAlign:"center",marginTop:"150px"}}>

      <h1>MockMate AI Interview</h1>

      <input placeholder="Email" style={{padding:"10px",margin:"10px"}}/>
      <br/>

      <input type="password" placeholder="Password" style={{padding:"10px",margin:"10px"}}/>
      <br/>

      <button
        onClick={()=>navigate("/dashboard")}
        style={{padding:"10px",background:"blue",color:"white"}}
      >
        Login
      </button>

    </div>

  );
}

export default Login;