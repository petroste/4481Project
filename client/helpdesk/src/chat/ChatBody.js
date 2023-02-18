import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import "./chat.css"

const ChatBody = ({ socket, messages, recepient, userName }) => {
  const navigate = useNavigate();
  const { authenticated } = useContext(authContext);

  const handleLeaveChat = () => {
    localStorage.removeItem('userID');
    //If user is authenticated or not handle leaving the chat differently.
    if(authenticated){
      //If agent is authenticated remove chat and display something else probably another chat
    }
    else{
      //User user is not authenticated so stop
      navigate('/home')
    }
  };

  return (
    <>
      <header className="chat__mainHeader">
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
        <h1 id="chatTitle">{userName}</h1>
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