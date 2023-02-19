import axios from "axios";

const API_URL = "http://localhost:4000/";

//Handles http requests involving the user tokens.
class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "login", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout(username) {
    localStorage.removeItem("user");
  }

 // register(username, email, password) {
 //   return axios.post(API_URL + "signup", {
 //     username,
 //     email,
 //     password
 //   });
 //  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();