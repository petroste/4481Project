import React, { useState } from 'react';
import { useResolvedPath } from 'react-router-dom';
import "./chat.css"

const ChatFooter = ({ socket, recepient, users, setUsers, messages, setMessages }) => {
  const [message, setMessage] = useState("")
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem("userID")) {
      socket.emit('message', {
        content: message,
        to: recepient.userID
      });
      users.forEach((user) => {
        user.messages.push({
          content: message,
          fromSelf: true
        })
      })
      setUsers(users)
      setMessages([...messages, { content: message, from: socket.userID, to: recepient.userID }])
      setMessage("")
    }
  };

  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;