import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import roles from '../enums';
import "./chat.css"
import useSessionStorage from '../auxiliary/sessionHelper';
import userContext from '../userContext';

const ChatBar = ({ socket, user, users, setUsers, setRecepient, recepient, setMessages }) => {
  const navigate = useNavigate();
  const [value, setValue] = useSessionStorage('a', 'b');
  let agentToConnect = sessionStorage.getItem("agentToConnect");
  const initReactiveProperties = (u) => {
    u.hasNewMessages = false;
  };
  // const { user } = useContext(userContext);
  useEffect(() => {
    socket.on('users', (currentUsers) => {
      currentUsers.forEach((u) => {
        console.log(JSON.stringify(u))
        u.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        for (let i = 0; i < currentUsers.length; i++) {
          const existingUser = currentUsers[i];
          if (existingUser.userID === u.userID) {
            existingUser.connected = u.connected;
            existingUser.messages = u.messages;
            return;
          }
        }
        u.self = u.userID === socket.userID;
        if (recepient.userID)
          if (u.userID === recepient.userID)
            setMessages(u.messages)
        initReactiveProperties(u);
      });
      const sortedUsers = currentUsers.sort((a, b) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.userName < b.userName) return -1;
        return a.userName > b.userName ? 1 : 0;
      });
      setUsers(sortedUsers);
    })
    socket.on("connect", () => {
      users.forEach((u) => {
        if (u.self) {
          u.connected = true;
        }
      });
      setUsers(users)
    });
    socket.on("disconnect", () => {
      users.forEach((u) => {
        if (u.self) {
          u.connected = false;
        }
      });
      setUsers(users)
    });
    // socket.on("user connected", (u) => {
    //   for (let i = 0; i < users.length; i++) {
    //     const existingUser = users[i];
    //     if (existingUser.userID === u.userID) {
    //       existingUser.connected = true;
    //       return;
    //     }
    //   }
    //   initReactiveProperties(u);
    //   users.push(u);
    //   setUsers(users);
    // });
    socket.on("user disconnected", (id) => {
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (u.userID === id) {
          user.connected = false;
          break;
        }
      }
    });
  }, [users])
  useEffect(() => {
    socket.on('customerReassigned', ({ originalAgent, targetAgent, customer }) => {

      if (sessionStorage.getItem("userName") === customer) {
        sessionStorage.setItem("agentToConnect", targetAgent);
        agentToConnect = sessionStorage.getItem("agentToConnect");
      }
      else if (sessionStorage.getItem("userName") === targetAgent) {
        sessionStorage.setItem(customer, "present");
      }
      else if (sessionStorage.getItem("userName") === originalAgent) {
        sessionStorage.removeItem(customer);
      }
      else {
        // do nothing
      }
      // CODE BELOW WORKS
      // DO NOT TOUCH
      if (value === 'b') {
        setValue('c');
      }
      else {
        setValue('b');
      }

    });



    // if (document.getElementsByClassName("chat__button").length === 0 && sessionStorage.getItem("agentToConnect") != null) {
    //   alert("Agent has left the chat. Please return to Home and try to connect to a new agent.")
    // }
  }, [socket, users, value])

  const handleClick = (e) => {

    let buttons = Array.from(document.getElementsByClassName("chat__button"))

    for (const element of buttons) {
      element.style.backgroundColor = "#295cf5";
    }
    e.target.style.backgroundColor = "#FFFFFF";


  }

  const handleRecepient = (u) => {
    setRecepient(u);
  }


  if (user.role === roles.AGENT) {
    return (
      <div className="chat__sidebar">
        <h2>Help Desk Chat</h2>
        <div>
          {(<h4 className="chat__header">Active Clients</h4>)}
          <div className="chat__users">
            {users.map(u => (u.role === roles.CUSTOMER) ?
              (<button className='chat__button' onClick={(e) => { handleClick(e); handleRecepient(u); }} key={u.userID}>{u.userName} | {u.connected.toString()}</button>) : (<></>)
            )}
          </div>
        </div>
        <div>
          {(<h4 className="chat__header">Active Agents</h4>)}
          <div className="chat__users">
            {users.map(u => (u.userName !== user.userName && u.role === roles.AGENT) ?
              (<button className='chat__button' onClick={(e) => { handleClick(e); handleRecepient(u); }} key={u.userID}>{u.userName} | {u.connected.toString()}</button>) : (<></>)
            )}
          </div>
        </div>
      </div>
    );
  }
  else if (user.role === roles.CUSTOMER) {
    return (
      <div className="chat__sidebar">
        <h2>Help Desk Chat</h2>
        <div>
          {(<h4 className="chat__header">Active Agent</h4>)}
          <div className="chat__users">
            {console.log(JSON.stringify(agentToConnect))}
            {users.map(u => (u.role === roles.AGENT && u.userName === `${agentToConnect}`) ?
              (<button className='chat__button' onClick={(e) => { handleClick(e); handleRecepient(u); }} key={u.userID}>{u.userName} | {u.connected.toString()}</button>) : (<></>)
            )}
          </div>
        </div>
      </div>
    );
  }
};

export default ChatBar;
