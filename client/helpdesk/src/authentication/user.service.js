import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://localhost:4000/login";

//Used to send request based on user type.
class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }
  
}

export default new UserService();