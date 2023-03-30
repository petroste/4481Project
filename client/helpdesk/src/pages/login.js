import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import '../components/login.css';
import roles from '../enums';
import AuthService from "../authentication/auth.service";
import { V0alpha2Api, FrontendApi, Configuration, Session, Identity } from "@ory/client"

// Get your Ory url from .env
// Or localhost for local development
const basePath = "http://localhost:8080"
const ory = new FrontendApi(
    new Configuration({
        basePath,
        baseOptions: {
            withCredentials: true,
        },
    }),
)

export default function Login({ socket }) {
    const navigate = useNavigate();
    const [errMsgs, setErrMsgs] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { setAuthenticated } = useContext(authContext);
    const [session, setSession] = useState()
    const [logoutUrl, setLogoutUrl] = useState("")
    let userName = ""
    let password = ""
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

    // Returns either the email or the username depending on the user's Identity Schema
    const getUserName = (identity) => {
        return identity.traits.username
    }

    const handleLogin = (identity) => {
        setIsSubmitted(true);
        setAuthenticated(true);
        socket.auth = { userName: identity.traits.username, role: roles.AGENT }
        socket.connect();
        socket.on("session", ({ sessionID, userID, role }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            sessionStorage.setItem("sessionID", sessionID);
            sessionStorage.setItem("userID", socket.userID);
            sessionStorage.setItem("userName", identity.traits.username);
            // save the ID of the user
            socket.userID = userID;
            socket.role = role;
        });

        navigate("/tempchat");
    }

    useEffect(() => {
        //Authenticate the user
        ory
            .toSession()
            .then(({ data: session }) => {
                // User has a session!
                setSession(session)
                ory.createBrowserLogoutFlow().then(({ data }) => {
                    // Get also the logout url
                    setLogoutUrl(data.logout_url)

                }).then(() => {
                    handleLogin(session.identity)
                })
            })
            .catch((err) => {
                console.error(err)
                // Redirect to login page
                window.location.replace(`${ory.basePath}/ui/login`)
            })
    }, [])


    if (!session) {
        return (
            <div className='page'>
                <div className='login-page'>
                    <h1>Redirecting to Login...</h1>
                </div>
            </div>

        );
    } else {
        return (
            <div className='page'>
                <div className='login-page'>
                    <h1>Logging In...</h1>
                </div>
            </div>

        );
    }
}
