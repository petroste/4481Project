import React, { useEffect, useState, useContext } from 'react';
import ChatBar from '../chat/ChatBar';
import ChatBody from '../chat/ChatBody';
import ChatFooter from '../chat/ChatFooter';
import "../chat/chat.css"
import UserService from '../authentication/user.service';
import userContext from '../userContext';
import roles from '../enums';

const Chat = ({ socket, recepient, setRecepient, messages, setMessages, users, setUsers }) => {
  const { user, setUser } = useContext(userContext);
  useEffect(() => {
    console.log(`current user: \n ${JSON.stringify(user)}`)
    const sessionID = sessionStorage.getItem("sessionID");
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    } else {
      socket.auth = { userName: user.userName, role: user.role }
      socket.connect();
    }
    socket.on("session", ({ sessionID, userID, role, userName }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      sessionStorage.setItem("sessionID", sessionID);
      sessionStorage.setItem("userID", userID);
      sessionStorage.setItem("userName", userName);
      // save the ID of the user
      socket.userID = userID;
      socket.role = role;
      socket.userName = userName
      const currentUser = {
        userName: userName,
        role: role
      }
      if (socket.role === roles.CUSTOMER) {
        UserService.getAgentToConnect(currentUser.userName).then(() => {

          sessionStorage.setItem("agentToConnect", sessionStorage.getItem("agent").substring(1, sessionStorage.getItem("agent").length - 1));
        })
      }
      setUser(currentUser)
    });

  }, [])

  useEffect(() => {
    // socket.on('refresh', () => {
    //   let agent = sessionStorage.getItem("userName");
    //   //  alert(agent);
    //   UserService.getCustomerList(agent).then(() => { }, error => {
    //     console.log("Unable to get list of customers for some reason.");
    //   });
    // });

    socket.on('messageResponse', (message) => {
      // console.log(`current users in chat.js: \n ${JSON.stringify(users)}}`)
      users.forEach((u) => {
        // if (message.f=== socket.userID && u.userID === socket.userID) {
        //   u.messages.push({
        //     content: message.content,
        //     fromSelf: false
        //   });

        // }
        const fromSelf = socket.userID === message.from
        if (u.userID === (fromSelf ? message.to : message.from)) {
          u.messages.push({
            content: message.content,
            fromSelf
          });
        }
      })
      setUsers(users)
      setMessages([...messages, message])
    })
  }, [socket, messages, users]);

  socket.on("confirmUpload", (message) => {
    users.forEach((u) => {
      const fromSelf = socket.userID === message.from
      if (u.userID === (fromSelf ? message.to : message.from)) {
        u.messages.push({
          content: message.content,
          fromSelf,
          type: "file"
        });
      }
    })
    setUsers(users)
    setMessages([...messages, message])
  });


  return (
    <div className="chat">
      <ChatBar socket={socket} user={user} users={users} setUsers={setUsers} setRecepient={setRecepient} recepient={recepient} setMessages={setMessages} />
      <div className="chat__main">
        <ChatBody socket={socket} users={users} recepient={recepient} messages={messages} setMessages={setMessages} />
        <ChatFooter socket={socket} recepient={recepient} users={users} setUsers={setUsers} messages={messages} setMessages={setMessages} />
      </div>
    </div>
  );
};

export default Chat;
