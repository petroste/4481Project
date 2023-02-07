import React, { Component, useState } from 'react'
import { useNavigate } from "react-router-dom";
import App from '../App';
import '../components/login.css';

//Login the user
export default function Login() {

  const [isSubmitted, setIsSubmitted] = useState(false);
  let navigate = useNavigate(); 

  const handleSubmit = (e) => {
    //e.preventDefault();
    //alert("User successfully logged in");
    // pass the info to the back end
    setIsSubmitted(true);
    let path = `/tempchat`; 
    navigate(path);
    // query against the db
    // setErrMsgs() when username/pw incorrect
  };

  const renderStartChat = (
    <>
      <div className='login-page-title'>Begin Chat Session</div>
      <div className='unauth-login-form'>
          <form onSubmit={handleSubmit}>
              <div className='input-fields'>
                  <label>Name</label>
                  <input type='text' name='username' required />
                  
              </div>
              <div className='input-fields'>
                  <label>Please describe your issue.</label>
                  <textarea rows="5" cols="80" name="issue" required ></textarea>
                
              </div>
              <div className='submit-button'>
                  <input type="submit"/>
              </div>
          </form>
      </div>
    </>
  );

  return(
    <div className='page'>
      <div>
      {renderStartChat}
      </div>
    </div>
  );
}


