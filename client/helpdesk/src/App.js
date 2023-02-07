import Navbar from './components/index.js';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
import Login from './pages/login.js';
import Chat from './pages/tempchat.js';
import './App.css';
  
function App() {
    return (
        <div className='navbar-main'>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/home' exact element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/login' element={<Login />} />
              <Route path='/tempchat' element={<Chat />} />
            </Routes>
          </BrowserRouter>
        </div>
    );
}
  
export default App;