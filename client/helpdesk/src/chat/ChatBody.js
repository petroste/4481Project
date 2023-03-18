import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import "./chat.css"

const ChatBody = ({ socket, messages, recepient, userName }) => {
  const navigate = useNavigate();
  const { authenticated } = useContext(authContext);

  const handleLeaveChat = () => {
    sessionStorage.removeItem('userID');
    //If user is authenticated or not handle leaving the chat differently.
    if(authenticated && recepient.userName !== null){
      sessionStorage.removeItem(recepient.userName);
    }
    else{
      //User user is not authenticated so stop
      sessionStorage.clear();
      socket.disconnect();
      navigate('/home')
    }
  };

  return (
    <>
      <header className="chat__mainHeader">
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
          <h1 className="user_name">{recepient.userName}</h1> 
      </header>

      <div className="message__container">
      {recepient.userName !== null && sessionStorage.getItem("agentToConnect") !== null ? (
                  <div className="message__chats">
                  <p>{recepient.userName}</p>
                  <div className="message__recipient"> 
                  <p>Hello my name is, {sessionStorage.getItem("agentToConnect")}. I am the agent that will be taking care of your issue. 
                  Please click the blue button on your left with my name to open our chat, then type your issue below and I will respond as soon as possible!</p> 
                  </div>
                  </div>
      ): (<></>)}

              
       
        {messages.map((message, index) => (
          message.type === "image" ? (
            message.from === socket.userID && message.to === recepient.userID ? (
              <div className="message__chats" key={index}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <img src={message.content} alt="image" width="200" height="200"/>
              </div>
            </div>
            ) : (
              <div className="message__chats" key={index}>
              <p>{recepient.userName}</p>
              <div className="message__recipient">
                <img src={message.content} alt="image" width="200" height="200"/>
              </div>
            </div>
            )
          ) : (
            message.from === socket.userID && message.to === recepient.userID ? (
              <div className="message__chats" key={index}>
                <p className="sender__name">You</p>
                <div className="message__sender">
                  <p>{message.content}</p>
                </div>
              </div>
            ) : (
              message.from === recepient.userID && message.type === undefined ? (
                <div className="message__chats" key={index}>
                <p>{recepient.userName}</p>
                <div className="message__recipient">
                  <p>{message.content}</p>
                </div>
              </div>
              ) : (<></>)
            )
          )
        
        ))}
      </div>
    </>
  );
};

export default ChatBody;