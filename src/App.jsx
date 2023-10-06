import Router from "./Router";
import React from 'react'
import './App.css'
import { useAuth } from "./context/AuthContext";
import { io } from 'socket.io-client';

const App = () => {
  const { auth } = useAuth(); 

  return (
    <div>
      <Router />
    </div>
  );
};

export default App
