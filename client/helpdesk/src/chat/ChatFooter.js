import React, { useState, useRef } from 'react';
import { useResolvedPath } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import "./chat.css"


const ChatFooter = ({ socket, recepient, users, setUsers, messages, setMessages }) => {
  const [message, setMessage] = useState("")
  const fileRef = useRef();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && sessionStorage.getItem("userID")) {
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
      setMessages([...messages, { content: message, from: socket.userID, to: recepient.userID, type: "basicMessage" }])
      setMessage("")
    }
  };

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 1e8; // 100MB maximum file size
    if (file.size > maxSize) {
      alert("File size exceeds the maximum allowed limit.");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const data = reader.result;
      if(data.startsWith("data:image/jpeg") || data.startsWith("data:image/png")){
        socket.emit("upload", { data, from: socket.userID, to: recepient.userID });
        setUsers(users);
        setMessages([...messages, { content: reader.result, from: socket.userID, to: recepient.userID, type: "image" }]);
        setMessage("");
      }
      else if(data.startsWith("data:application/pdf") || data.startsWith("data:text/plain")){
        socket.emit("upload", { data, from: socket.userID, to: recepient.userID });
        setUsers(users);
        setMessages([...messages, { content: reader.result, from: socket.userID, to: recepient.userID, type: "file" }]);
        setMessage("");
      }
      else{
        alert("File type not supported!");
      }
    };
  }

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
        <InputAdornment position="end">
        <input
                onChange={fileSelected}
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
        />
          <IconButton type="button" edge="end" onClick={selectFile}>
            <AttachFileIcon />
          </IconButton>
        </InputAdornment>
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;