import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'https://fiscord.uw.r.appspot.com/';

export const socket = io("https://fiscord.uw.r.appspot.com/");


socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});