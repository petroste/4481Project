import React, { useState, useEffect } from 'react';
import roles from '../enums';
import "./chat.css"
import useSessionStorage from '../auxiliary/sessionHelper';

const ChatBar = ({ socket, users, setUsers, setRecepient}) => {
  const [userName, setUserName] = useState("No user");
  const [value, setValue] = useSessionStorage('a', 'b');
  let agentToConnect = sessionStorage.getItem("agentToConnect");
  
  useEffect(() => {
    socket.on('customerReassigned', ({ originalAgent, targetAgent, customer }) => {

          if (sessionStorage.getItem("userName") === customer)
          {
            sessionStorage.setItem("agentToConnect", targetAgent);
            agentToConnect = sessionStorage.getItem("agentToConnect");
          }
          else if(sessionStorage.getItem("userName") === targetAgent)
          {
            sessionStorage.setItem(customer, "present");
          }
          else if(sessionStorage.getItem("userName") === originalAgent)
          {
            sessionStorage.removeItem(customer);
          }
          else
          {
            // do nothing
          }
          // CODE BELOW WORKS
          // DO NOT TOUCH
          if (value === 'b')
          {
            setValue('c');
          }
          else
          {
            setValue('b');
          }

    });
    socket.on('users', (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        user.self = user.userID === socket.userID;
      });
      setUsers(users);
    })
    
    if(document.getElementsByClassName("chat__button").length === 0 && sessionStorage.getItem("agentToConnect") != null){
      alert("Agent has left the chat. Please return to Home and try to connect to a new agent.")
    }
  }, [socket, users, value])

  const handleClick = (e) => {

    let buttons = Array.from(document.getElementsByClassName("chat__button"))

    for (const element of buttons)
    {
      element.style.backgroundColor = "#295cf5";
    }
      e.target.style.backgroundColor = "#FFFFFF";

    
  }

  const handleRecepient = (user) => {
    setRecepient(user);
  }
  
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        {(socket.role === roles.AGENT) ? (<h4 className="chat__header">ACTIVE CUSTOMERS</h4>) : (<h4 className="chat__header">ACTIVE AGENTS</h4>)}

        <div className="chat__users">
          {(socket.role === roles.AGENT) ? (
            users.map(user => (socket.userID !== user.userID && user.role === roles.CUSTOMER && sessionStorage.getItem(user.userName) !== null) ?
              (<button className='chat__button' onClick={(e) => {handleClick(e); handleRecepient(user);}} key={user.userID}>{user.userName} | {user.role}</button>)
               : (<></>)
            )
          ) : (
            users.map(user => (user.role === roles.AGENT && ("\"" + user.userName + "\"" === agentToConnect || user.userName === agentToConnect)) ?
              (<button className='chat__button' onClick={(e) => {handleClick(e); handleRecepient(user);}} key={user.userID }>{user.userName} | {user.role}</button>) : (<></>)
            )
          )}
        </div>
      </div>
      <div>
        {(socket.role === roles.AGENT) ? (<h4 className="chat__header">ACTIVE AGENTS</h4>) : (<div></div>)}
        <div className='chat__users'>
          {(socket.role === roles.AGENT) ? (
            users.map(user => (socket.userID !== user.userID && user.role === roles.AGENT) ?
            (<button className='chat__button' onClick={(e) => {handleClick(e); handleRecepient(user);}} key={user.userID }>{user.userName} | {user.role}</button>) : (<></>)
          )
          ) : (<></>)}
        </div>
        
      </div>
    </div>
  );
};

export default ChatBar;
