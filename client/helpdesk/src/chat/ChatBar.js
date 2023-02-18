import React, { useState, useEffect } from 'react';
import roles from '../enums';
import "./chat.css"

const ChatBar = ({ socket, users, setUsers, setRecepient}) => {
  const [userName, setUserName] = useState("No user");

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
  
  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>

      <div>
        {(socket.role === roles.AGENT) ? (<h4 className="chat__header">ACTIVE CUSTOMERS</h4>) : (<h4 className="chat__header">ACTIVE AGENTS</h4>)}

        <div className="chat__users">
          {(socket.role === roles.AGENT) ? (
            users.map(user => (socket.userID !== user.userID) ?
              (<button onClick={() => setRecepient(user)} key={user.userID}>{user.userName} | {user.role}</button>) : (<></>)
            )
          ) : (
            users.map(user => (user.role === roles.AGENT) ?
              (<button onClick={() => setRecepient(user)} key={user.userID }>{user.userName} | {user.role}</button>) : (<></>)
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatBar;
