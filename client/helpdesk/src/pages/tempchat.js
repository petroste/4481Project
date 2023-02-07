import React from 'react';
import ChatBar from '../chat/ChatBar';
import ChatBody from '../chat/ChatBody';
import ChatFooter from '../chat/ChatFooter';
import "../chat/chat.css"

const tempchat = ({ socket }) => {
  return (
    <div className="chat">
      <ChatBar />
      <div className="chat__main">
        <ChatBody />
        <ChatFooter socket={socket}/>
      </div>
    </div>
  );
};

export default tempchat;
