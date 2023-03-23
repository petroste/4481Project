import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../authentication/user.service';
import roles from '../enums';

export default function Home ({ socket  }){

  const navigate = useNavigate();
  let issue = ""
  let userName = ""
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault();
    UserService.getAgentToConnect(userName).then( () => {
        socket.auth = { userName: userName, role: roles.CUSTOMER }
        socket.connect();
        socket.on("session", ({ sessionID, userID, role }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // store it in the localStorage
        sessionStorage.setItem("sessionID", sessionID);
        sessionStorage.setItem("userID", socket.userID);
        sessionStorage.setItem("agentToConnect", sessionStorage.getItem("agent"));
        sessionStorage.setItem("userName", userName);
        // save the ID of the user
        socket.userID = userID;
        socket.role = role;
        });
        navigate('/tempchat');
    },
    error => {
        alert("There are no active agents currently, please try again later.");
    });

  };

  const setIssue = (value) => {
    issue = value
  }
  const setUserName = (value) => {
    userName = value
  }
  return (
    <>
      <div className='page'>
        <div className='login-page-title'>Begin Chat Session</div>
        <div className='unauth-login-form'>
          <form onSubmit={handleSubmit}>
            <div className='input-fields'>
              <label htmlFor="username">Name</label>
              <input type="text"
                minLength={6}
                onChange={(e) => setUserName(e.target.value)} required />

            </div>
            <div className='client-submit'>
              <input type="submit" value="Begin Chat"/> 
            </div>
          </form>
        </div>
      </div>
    </>
  );
};