import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard(){

  const navigate = useNavigate();

  return(

    <div>

      <Navbar/>

      <div style={{padding:"40px"}}>

        <h1>Welcome to MockMate</h1>

        <p>Your AI Interview Preparation Platform</p>

        <div style={{marginTop:"30px"}}>

          <button
            onClick={()=>navigate("/resume")}
            style={{
              padding:"15px",
              background:"green",
              color:"white",
              marginRight:"20px",
              border:"none",
              cursor:"pointer"
            }}
          >
            Upload Resume
          </button>

          <button
            onClick={()=>navigate("/interview")}
            style={{
              padding:"15px",
              background:"blue",
              color:"white",
              border:"none",
              cursor:"pointer"
            }}
          >
            Start Interview
          </button>

        </div>


        <div style={{marginTop:"60px"}}>

          <h2>Recent Interviews</h2>

          <table border="1" cellPadding="10">

            <thead>
              <tr>
                <th>Role</th>
                <th>Date</th>
                <th>Score</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Data Analyst</td>
                <td>10 March</td>
                <td>7.5</td>
              </tr>
            </tbody>

          </table>

        </div>


      </div>

    </div>

  )

}

export default Dashboard;