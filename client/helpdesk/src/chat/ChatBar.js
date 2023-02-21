import React, { useState, useEffect } from 'react';
import roles from '../enums';
import "./chat.css"

const ChatBar = ({ socket, users, setUsers, setRecepient}) => {
  const [userName, setUserName] = useState("No user");
  var agentToConnect = localStorage.getItem(localStorage.getItem("userID") + "Agent");
  
  useEffect(() => {
    socket.on('users', (users) => {
      users.forEach((user) => {
        user.messages.forEach((message) => {
          message.fromSelf = message.from === socket.userID;
        });
        user.self = user.userID === socket.userID;
      });
      setUsers(users)
    })
  }, [socket, users])

  const handleClick = (e) => {

    var buttons = Array.from(document.getElementsByClassName("chat__button"))

    for (let i = 0; i < buttons.length; i++)
    {
      buttons[i].style.backgroundColor = "#295cf5";
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
            users.map(user => (socket.userID !== user.userID && user.role === roles.CUSTOMER) ?
              (<button className='chat__button' onClick={(e) => {handleClick(e); handleRecepient(user);}} key={user.userID}>{user.userName} | {user.role}</button>) : (<></>)
            )
          ) : (
<<<<<<< HEAD
            users.map(user => (user.role === roles.AGENT && "\"" + user.userName + "\"" === agentToConnect) ?
              (<button onClick={() => setRecepient(user)} key={user.userID }>{user.userName} | {user.role}</button>) : (<></>)
=======
            users.map(user => (socket.userID !== user.userID && user.role === roles.AGENT) ?
              (<button className='chat__button' onClick={(e) => {handleClick(e); handleRecepient(user);}} key={user.userID }>{user.userName} | {user.role}</button>) : (<></>)
>>>>>>> 58c5e39a (various small changes)
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
