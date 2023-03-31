import React, { Component, useContext, useState } from 'react';
import Navbar from './components/index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
import Login from './pages/login.js';
import Chat from './pages/chat.js';
import Switch from './pages/switch.js';
import './App.css';
import authContext from "./authContext";
import socket from './sockets/index.js';
import userContext from './userContext.js';


function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [recepient, setRecepient] = useState({});
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  return (
    <div className='navbar-main'>
      <userContext.Provider value={{ user, setUser }}>
        {/* <authContext.Provider value={{ authenticated, setAuthenticated }} > */}
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/home' exact element={<Home socket={socket} />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login socket={socket} />} />
            <Route path='/switch' element={<Switch socket={socket} />} />
            <Route path='/tempchat' element={<Chat socket={socket} recepient={recepient} setRecepient={setRecepient} messages={messages} setMessages={setMessages} users={users} setUsers={setUsers} />} />
          </Routes>
        </BrowserRouter>
        {/* </authContext.Provider> */}
      </userContext.Provider>
    </div>
  );
}

export default App;