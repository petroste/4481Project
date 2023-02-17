import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./chat.css"

const ChatBody = ({ socket, messages, recepient }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    localStorage.removeItem('userID');
    navigate('/home');
    window.location.reload();
  };

  return (
    <>
      <header className="chat__mainHeader">
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message, index) => (
          message.from === socket.userID && message.to === recepient.userID ? (
            <div className="message__chats" key={index}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (<></>)
        ))}
        {messages.map((message, index) => (
          message.from === recepient.userID ? (
            <div className="message__chats" key={index}>
              <p>{recepient.userName}</p>
              <div className="message__recipient">
                <p>{message.content}</p>
              </div>
            </div>
          ) : (<></>)
        ))}
      </div>
    </>
  );
};

export default ChatBody;