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

  getAgentToConnect(userName){
    return axios.post(API_URL + "getAgent", {
            userName
          })
          .then(response => {        
            if (response.data.agent) {
              sessionStorage.setItem("agent", JSON.stringify(response.data.agent));
            }
            return response.data; 
          });
  }

  getCustomerList(agent){
    return axios.post(API_URL + "getCustomerList", {
            agent
          })
          .then(response => {
            const customers = response.data.customers;
           if (customers){
              for(const element of customers){
                sessionStorage.setItem(element, "present");
              }
           }

            return response.data; 
          });
  }

  assignCustomerToAgent(originalAgent, targetAgent, customer){
    return axios.post(API_URL + "assign", {
        originalAgent,
        targetAgent,
        customer
    })
    .then(response => {
      sessionStorage.removeItem(customer);
    }
    );
  }
  
}

export default new UserService();