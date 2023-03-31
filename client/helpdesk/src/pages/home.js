import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../authentication/user.service';
import roles from '../enums';
import { FrontendApi, Configuration, Session, Identity, } from "@ory/client"
import axios from 'axios';
import userContext from '../userContext';

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



export default function Home({ socket }) {
  const navigate = useNavigate();
  let issue = ""
  let userName = ""
  const [message, setMessage] = useState("")
  const [session, setSession] = useState()
  const [logoutUrl, setLogoutUrl] = useState("")
  const [clientUser, setClientUser] = useState("")
  const [flow, setFlow] = useState()
  const { user, setUser } = useContext(userContext);
  useEffect(() => {
    //Authenticate the user
    ory
      // the cookie is automatically sent with the request
      .toSession()
      .then(({ data: session }) => {
        if (session.identity.traits.role === roles.CUSTOMER)
          setSession(session)
      })
      .catch((error) => {

      })
  }, [])


  const initClientSession = () => {
    // The session could not be fetched
    // This might occur if the current session has expired
    ory.createBrowserLoginFlow().then((res) => {
      ory.updateLoginFlow({
        flow: res.data.id, updateLoginFlowBody: {
          "csrf_token": res.data.ui.nodes[0].attributes.value,
          "identifier": "client",
          "method": "password",
          "password": "eecshelpdesk",
          "password_identifier": "password"
        }
      }
      ).then((res) => {
        console.log(res.data.session.id)
        setSession(res.data.session)
        ory.createBrowserLogoutFlow().then(({ data }) => {
          // Get also the logout url
          setLogoutUrl(data.logout_url)
          localStorage.setItem("logout_token", data.logout_token)
        })
      })

    })

    // axios({
    //   method: 'get',
    //   url: "http://localhost:8080/self-service/login/browser",
    //   headers: {
    //     Accept: 'application/json'

    //   },
    //   xsrfHeaderName: 'X-CSRF-Token'
    // }).then(function (res) {
    //   console.log(res.data.ui.nodes[0].attributes.value)
    //   axios({
    //     method: 'post',
    //     url: res.data.ui.action,
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //       // 'X-CSRF-TOKEN': res.headers['set-cookie']
    //     },
    //     data: {
    //       "identifier": "client",
    //       "password": "eecshelpdesk",
    //       "method": "password",
    //       "csrf_token": res.data.ui.nodes[0].attributes.value
    //     },
    //     xsrfHeaderName: 'X-CSRF-Token',
    //     withCredentials: true
    //   })
    //   // .catch(err => console.log(err))
    // })
    // // .catch((err) => console.log(err))
  }

  // const connectToAgent = () => {
  //   UserService.getAgentToConnect(userName).then(() => {
  //     socket.auth = { userName: userName, role: roles.CUSTOMER }
  //     socket.connect();
  //     socket.on("session", ({ sessionID, userID, role }) => {
  //       // attach the session ID to the next reconnection attempts
  //       socket.auth = { sessionID };
  //       // store it in the localStorage
  //       sessionStorage.setItem("sessionID", sessionID);
  //       sessionStorage.setItem("userID", socket.userID);
  //       sessionStorage.setItem("agentToConnect", sessionStorage.getItem("agent"));
  //       sessionStorage.setItem("userName", userName);
  //       // save the ID of the user
  //       socket.userID = userID;
  //       socket.role = role;
  //     });
  //   },
  //     error => {
  //       alert("There are no active agents currently, please try again later.");
  //     });
  // }

  const handleSubmit = (e) => {
    if (!session)
      initClientSession()
    e.preventDefault();
    navigate('/tempchat');
  };

  const setIssue = (value) => {
    issue = value
  }
  const setUserName = (value) => {
    userName = value
    const user = {
      userName: value,
      role: roles.CUSTOMER
    }
    setUser(user)
  }
  if (!session) {
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
                <input type="submit" value="Begin Chat" />
              </div>
            </form>
          </div>
        </div>
      </>
    );
  } else {
    navigate('/tempchat')
  }
};