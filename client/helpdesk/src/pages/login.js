import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import '../components/login.css';

export default function Login() {
    const navigate = useNavigate();
    const [errMsgs, setErrMsgs] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {setAuthenticated} = useContext(authContext);

    const err = {
        username: "Invalid username! Please enter a correct username.",
        password: "Invalid password! Please enter the correct password."
      };

    const renderErrMsg = (name) =>
        name === errMsgs.name && 
        (<div className='error'>{errMsgs.msg}</div>);

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert("User successfully logged in");
        setIsSubmitted(true);
        setAuthenticated(true);
        navigate('/tempchat');
        // pass the info to the back end
        // query against the db
        // setErrMsgs() when username/pw incorrect
    };


    const renderLoginData = (
        
        <>
            <div className='login-page-title'>Chat Agent Sign In</div>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <div className='input-fields'>
                        <label>Username</label>
                        <input type='text' name='username' required />
                        {renderErrMsg("username")}
                    </div>
                    <div className='input-fields'>
                        <label>Password</label>
                        <input type='password' name='password' required />
                        {renderErrMsg("password")}
                    </div>
                    <div className='submit-button'>
                        <input type="submit"/>
                    </div>
                </form>
            </div>
        </>

    );

  return (
    <div className='page'>
    <div className='login-page'>       
            {/* Here add redirection to user agent's page when successfully logged in */}
            <div>
            {isSubmitted ? handleSubmit : renderLoginData}
            </div>
        </div>
    </div>

  );
}
