import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authContext from '../authContext';
import "./chat.css"
import ory from '../authentication/auth-client'

const ChatBody = ({ socket, users, user, recepient, messages, setMessages }) => {
  const navigate = useNavigate();
  const { authenticated } = useContext(authContext);
  useEffect(() => {
    if (recepient.userID)
      users.forEach(u => {
        // if (u.userID === recepient.userID) {
        // u.messages.forEach(m =>
        // setMessages([...messages, m])
        // )
        // setMessages(u.messages)
        //
        // console.log(JSON.stringify(u.messages))
        // setMessages(u.messages)
        // }
      })
  }, [messages])
  const handleLeaveChat = async () => {
    const logoutToken = localStorage.getItem('logout_token')
    sessionStorage.clear();
    localStorage.clear();
    socket.disconnect();
    await ory.updateLogoutFlow({
      token: logoutToken
    }).then(() => navigate('/home'))
  }

  return (
    <>
      <header className="chat__mainHeader">
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>
      {(!recepient.userName) ? (
        <div className='page'>
          <div className='login-page'>
            <h2>Welcome to Help Desk Chat. Select a user to communicate with.</h2>
          </div>
        </div>
      ) : (

        <div className="message__container">
          {messages.map((message, index) => (
            message.type === "file" ? (
              message.from === socket.userID && message.to === recepient.userID ? (
                <div className="message__chats" key={index}>
                  <p className="sender__name">You</p>
                  <div className="image__sender">
                    <iframe src={message.content} alt="image" width="100%" height="800" />
                  </div>
                </div>
              ) : (
                <div className="message__chats" key={index}>
                  <p>{recepient.userName}</p>
                  <div className="image__recipient">
                    <iframe src={message.content} alt="image" width="100%" height="800" />
                  </div>
                </div>
              )
            ) : (
              message.type === "image" ? (
                message.from === socket.userID && message.to === recepient.userID ? (
                  <div className="message__chats" key={index}>
                    <p className="sender__name">You</p>
                    <div className="image__sender">
                      <img src={message.content} alt="image" width="100%" height="100%" />
                    </div>
                  </div>
                ) : (
                  <div className="message__chats" key={index}>
                    <p>{recepient.userName}</p>
                    <div className="image__recipient">
                      <img src={message.content} alt="image" width="100%" height="100%" />
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
            )
          ))}
        </div>
      )}
    </>
  );
}
export default ChatBody;