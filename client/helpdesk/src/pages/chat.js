import React, { useEffect, useState } from 'react';
import ChatBar from '../chat/ChatBar';
import ChatBody from '../chat/ChatBody';
import ChatFooter from '../chat/ChatFooter';
import "../chat/chat.css"
import UserService from '../authentication/user.service';

const Chat = ({ socket, recepient, setRecepient, messages, setMessages, users, setUsers}) => {

  useEffect(() => {

    socket.on('refresh', () => {
      var agent = sessionStorage.getItem("userName");
      //  alert(agent);
        UserService.getCustomerList(agent).then(() => {}, error => {
          console.log ("Unable to get list of customers for some reason.");
        });
    });

    socket.on('message', (message) => {
      users.forEach((user) => {
        const fromSelf = socket.userID === message.from
        if (user.userID === (fromSelf ? message.to : message.from)) {
          user.messages.push({
            content: message.content,
            fromSelf
          });
        }
      })
      setUsers(users)
      setMessages([...messages, message])
    })
  }, [socket, messages, users]);

  return (
    <div className="chat">
      <ChatBar socket={socket} users={users} setUsers={setUsers} setRecepient={setRecepient} />
      <div className="chat__main">
        <ChatBody socket={socket} messages={messages} recepient={recepient} />
        <ChatFooter socket={socket} recepient={recepient} users={users} setUsers={setUsers} messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default Chat;
