import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { loadAccount, registerUser } from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";
const Register = () => {
  const provider = useSelector((state) => state.Provider.connection);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const dispatch = useDispatch();
  const [registerType, setRegisterType] = useState("patient");
  const navigate = useNavigate();
  const [name, setName] = useState(0);
  const [age, setAge] = useState(0);
  const [problem, setProblem] = useState(0);
  const [details, setDetails] = useState(0);
  const registerHandler = (e) => {
    setRegisterType(e.target.value);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    loadAccount(provider, dispatch);
    if (registerType === "patient") {
      await registerUser(
        name,
        age,
        problem,
        registerType,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Patient", {
        state: {},
      });
    } else {
      await registerUser(
        name,
        details,
        problem,
        registerType,
        provider,
        medicalStorage,
        dispatch
      );
      navigate("/Doctor", {
        state: {},
      });
    }
    setName(0);
    setAge(0);
    setDetails(0);
    setProblem(0);
  };

  return (
    <div className="container">
      <h2>Register with web3 Swastchain</h2>
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Register as :</label>
          <select
            name="registerAs"
            onChange={registerHandler}
            value={registerType}
          >
            <option value="0" disabled>
              Select type of registration
            </option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            id="address"
            placeholder="Aman Gupta"
            onChange={(e) => setName(e.target.value)}
            value={name === 0 ? "" : name}
            required
          />
        </div>
        {registerType === "patient" ? (
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              id="address"
              placeholder="34"
              onChange={(e) => setAge(e.target.value)}
              value={age == 0 ? "" : age}
              required
            />
            <label>Problem:</label>
            <input
              type="text"
              id="address"
              placeholder="Diabities"
              onChange={(e) => setProblem(e.target.value)}
              value={problem === 0 ? "" : problem}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Details:</label>
            <input
              type="text"
              id="address"
              placeholder="Holding a mbbs digree"
              onChange={(e) => setDetails(e.target.value)}
              value={details === 0 ? "" : details}
              required
            />
          </div>
        )}

        <div className="form-group">
          <button type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
