import React from "react";
import { Link } from "react-router-dom";

function Navbar() {

  return (

    <div style={{
      background:"#111",
      color:"white",
      padding:"15px",
      display:"flex",
      justifyContent:"space-between"
    }}>

      <h2>MockMate AI</h2>

      <div>

        <Link to="/dashboard" style={{color:"white",marginRight:"20px"}}>Dashboard</Link>

        <Link to="/resume" style={{color:"white",marginRight:"20px"}}>Resume</Link>

        <Link to="/interview" style={{color:"white"}}>Interview</Link>

      </div>

    </div>

  );

}

export default Navbar;