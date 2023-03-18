# 4481Project

Welcome to Team 4's 4481 project for the Helpdesk application!

As the project is not being publicly hosted yet, the instructions to run the project will be included in the Milestone Report for Phase 1, or can be found below: 

  1. Node.js is required in order to run this project, and instructions on how it can be downloaded are at the following link: https://nodejs.org/en/ . Node version        can be checked by running node -v if already installed. 

  2. To download the project locally, run git clone https://github.com/petroste/4481Project.git in your testing directory, assuming git is installed on the user’s          machine. Alternatively, download and unpack the ZIP file from the github repository.

  3. After the files are installed, the user should be able to see 2 directories (client and server) in the 4481Project folder, which is the parent folder for the          project.

     The client folder is responsible for front-end related tasks, such as creating the Chatbody, login page, and the rest of the presentation tier. The server              directory contains all of the code required to run the Node server and perform backend related tasks as well. 

  4. It is important to install necessary packages to run the application. First, navigate to the 4481Project/client/helpdesk directory in a terminal, and issue the        command npm install to install all of the required packages and dependencies for the front-end of the application. Similarly, after this process is complete, do        the same for the server side, by navigating to 4481Project/server directory and issuing npm install. Again, this will automatically install all required packages      needed to run the back-end of the application. 

   5. After the setup is complete, the user is now ready to start the app. First, navigate to the 4481Project/server directory in a terminal, and run the command npm         start. This should start the node.js server on the application side and connect to the database.

      The server is now hosted on port 4000 on the local machine. Next, navigate to the 4481Project/client/helpdesk directory, and similarly run npm start. This will         start the React app on http://localhost:3000/ . Now, by navigating to this link, we will see the home screen of the application, and the user can now use the           application.
	
      The use cases of the project can be emulated by opening up several tabs with customers/agents. For demonstration purposes, the agent can login with the following       credentials: 
      
      Username: demo
      Password: d3mo1234!
      
      A customer (an unauthorized user in the project's case), can simply navigate to the home button and type in their name to start a chat with an available agent,         and does not need to sign in to use the app. 
