import { io } from "socket.io-client";

const socketURL = process.env.REACT_APP_SOCKET_URL
const socket = io(socketURL, { autoConnect: false });
// socket.onAny((event, ...args) => {
//     console.log(event, args);
// });

export default socket;