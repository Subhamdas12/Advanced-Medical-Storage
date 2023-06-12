import React, { useState } from "react";
import "./navbar.css";
const Navbar = ({ setLogin }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <a href="#">Swastchain</a>
      </div>
      <div className="navbar-right">
        <a href="#" onClick={() => setLogin(true)}>
          Login
        </a>
        <a href="#" onClick={() => setLogin(false)}>
          Register
        </a>
      </div>
    </div>
  );
};

export default Navbar;
