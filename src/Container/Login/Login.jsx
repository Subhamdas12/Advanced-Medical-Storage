import React, { useState } from "react";
import "./login.css";
import {
  checkDoctorAlreadyExists,
  checkPatientAlreadyExists,
  loadAccount,
} from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const dispatch = useDispatch();
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const provider = useSelector((state) => state.Provider.connection);
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState("patient");
  const submitHandler = async (e) => {
    e.preventDefault();
    await loadAccount(provider, dispatch);
    if (loginType === "patient") {
      const patientLogin = await checkPatientAlreadyExists(
        provider,
        medicalStorage
      );
      if (patientLogin) {
        navigate("/Patient", {
          state: {},
        });
      } else {
        alert("You are not registered as a patient, please register first");
      }
    } else {
      const doctorLogin = await checkDoctorAlreadyExists(
        provider,
        medicalStorage
      );

      if (doctorLogin) {
        navigate("/Doctor", {
          state: {},
        });
      } else {
        alert("You are not registered as a doctor, please register first");
      }
    }
  };
  return (
    <div className="container">
      <h2>Login with web3 Swastchain</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Login as :</label>
          <select
            name="loginAs"
            onChange={(e) => setLoginType(e.target.value)}
            value={loginType}
          >
            <option value="0" disabled>
              Select type of registration
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="form-group">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
