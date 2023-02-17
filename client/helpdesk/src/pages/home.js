import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import roles from '../enums';

const Home = ({ socket }) => {
  const navigate = useNavigate();
  var issue = ""
  var userName = ""
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.auth = { userName: userName, role: roles.CUSTOMER }
    socket.connect();
    socket.on("session", ({ sessionID, userID, role }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      localStorage.setItem("userID", socket.userID);
      // save the ID of the user
      socket.userID = userID;
      socket.role = role;
    });
    navigate('/tempchat');
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
            <div className='input-fields'>
              <label>Please describe your issue.</label>
              <textarea rows="5" cols="80" name="issue" onChange={(e) => setIssue(e.target.value)} required ></textarea>
            </div>
            <div className='submit-button'>
              <input type="submit" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;