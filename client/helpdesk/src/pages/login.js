import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import '../components/login.css';
import roles from '../enums';
import AuthService from "../authentication/auth.service";
export default function Login({ socket }) {
    const navigate = useNavigate();
    const [errMsgs, setErrMsgs] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { setAuthenticated } = useContext(authContext);
    var userName = ""
    var password= ""
    const err = {
        username: "Invalid username! Please enter a correct username.",
        password: "Invalid password! Please enter the correct password."
    };
    const setUserName = (value) => {
        userName = value
    }

    const setPassword = (value) => {
        password = value
    }

    const renderErrMsg = (name) =>
        name === errMsgs.name &&
        (<div className='error'>{errMsgs.msg}</div>);

    const handleSubmit = (e) => {
        e.preventDefault();
       
        //Authenticate the user
        AuthService.login(userName, password).then(
            () => {
                setIsSubmitted(true);
                setAuthenticated(true);
                socket.auth = { userName: userName, role: roles.AGENT }
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
                navigate("/tempchat");
            },
            error => {
                alert("Incorrect username or password.");
            }
        );
    };


    const renderLoginData = (

        <>
            <div className='login-page-title'>Chat Agent Sign In</div>
            <div className='login-form'>
                <form onSubmit={handleSubmit}>
                    <div className='input-fields'>
                        <label>Username</label>
                        <input type='text' name='username' onChange={(e) => setUserName(e.target.value)} required />
                        {renderErrMsg("username")}
                    </div>
                    <div className='input-fields'>
                        <label>Password</label>
                        <input type='password' name='password' onChange={(e) => setPassword(e.target.value)} required />
                        {renderErrMsg("password")}
                    </div>
                    <div className='submit-button'>
                        <input type="submit" />
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
