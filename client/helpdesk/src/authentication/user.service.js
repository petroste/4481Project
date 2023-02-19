import axios from 'axios';
import authHeader from './auth-header';

const API_URL = "http://localhost:4000/";

//Used to send request based on user type.
class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getAgentToConnect(){
    return axios.get(API_URL + "getAgent")
          .then(response => {        
            if (response.data.agent) {
              localStorage.setItem("agent", JSON.stringify(response.data.agent));
            }
            return response.data; 
          });
  }
  
}

export default new UserService();