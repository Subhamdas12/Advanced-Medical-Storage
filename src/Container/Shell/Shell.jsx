import React, { useState } from "react";
import "./shell.css";
import { Navbar } from "../../Components";
import Login from "../Login/Login";
import Register from "../Register/Register";
const Shell = () => {
  const [login, setLogin] = useState(true);
  return (
    <div>
      <Navbar setLogin={setLogin} />
      {login ? <Login /> : <Register />}
    </div>
  );
};

export default Shell;
