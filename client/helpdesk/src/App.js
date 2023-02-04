import Navbar from './components/index.js';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/home.js';
import About from './pages/about.js';
  
function App() {
    return (
        <div className='navbar-main'>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path='/' exact element={<Home />} />
              <Route path='/about' element={<About />} />
            </Routes>
          </BrowserRouter>
        </div>
    );
}
  
export default App;