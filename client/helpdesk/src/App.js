import React, { Component, useContext, useState }  from 'react';
import Navbar from './components/index.js';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
import Login from './pages/login.js';
import Chat from './pages/tempchat.js';
import './App.css';
import authContext from "./authContext";


function App() {
    const [authenticated, setAuthenticated] = useState(false);
    return (
        <div className='navbar-main'>
        <authContext.Provider value={{ authenticated, setAuthenticated }} >
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/home' exact element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/login' element={<Login />} />
              <Route path='/tempchat' element={<Chat />} />
            </Routes>
          </BrowserRouter>  
        </authContext.Provider>
        </div>
    );
}
  
export default App;