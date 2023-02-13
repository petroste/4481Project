import React, { useEffect, useState} from 'react';
import ChatBar from '../chat/ChatBar';
import ChatBody from '../chat/ChatBody';
import ChatFooter from '../chat/ChatFooter';
import "../chat/chat.css"

const tempchat = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default tempchat;
