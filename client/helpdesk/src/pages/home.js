import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({socket}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userName', userName);
    socket.emit('newUser', {userName, socketID: socket.id});
    navigate('/tempchat');
  };

  return (
  <>
  <div className='page'>
    <div className='login-page-title'>Begin Chat Session</div>
      <div className='unauth-login-form'>
          <form onSubmit={handleSubmit}>
              <div className='input-fields'>
                  <label htmlFor = "username">Name</label>
                  <input type="text"
                          minLength={6}
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)} required />
                  
              </div>
              <div className='input-fields'>
                  <label>Please describe your issue.</label>
                  <textarea rows="5" cols="80" name="issue" required ></textarea>
                
              </div>
              <div className='submit-button'>
                  <input type="submit"/>
              </div>
          </form>
      </div>
    </div>
  </>
  );
};

export default Home;