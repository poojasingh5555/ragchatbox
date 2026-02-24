import { useState } from 'react'
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register"; 
import Dashboard from "./pages/Dashboard";


function App() {
  

  return (
    <>
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path= "/dashboard" element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
      
      
      

