import React, { useEffect, useState } from "react";
import "./shareMedicalRecord.css";
import {
  addDoctor,
  getAllDoctorNameAddresses,
  getDoctorList,
} from "../../Store/Interactions";
import { useDispatch, useSelector } from "react-redux";
const ShareMedicalRecord = () => {
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const account = useSelector((state) => state.Provider.account);
  const provider = useSelector((state) => state.Provider.connection);
  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);
  const [doctorAddress, setDoctorAddress] = useState(null);
  const doctorHandler = (e) => {
    setDoctorAddress(e.target.value);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    addDoctor(provider, doctorAddress, medicalStorage, dispatch);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getAllDoctorNameAddresses(medicalStorage);
      setDoctorAddress(details && details[0] && details[0][1]);
      setDetails(details);
    };
    if (medicalStorage) {
      fetchDetails();
    }
  }, [medicalStorage]);
  return (
    <div className="shareMedicalRecord">
      <h2>Share your medical record</h2>
      <form onSubmit={submitHandler}>
        <p>
          <strong>Doctor : </strong>
        </p>
        <select name="" id="" onChange={doctorHandler}>
          {details &&
            details.map((detail, index) => (
              <option value={detail[1]} key={index}>
                {detail[0]}
              </option>
            ))}
        </select>
        <button className="btn" type="submit">
          Add doctor
        </button>
      </form>
    </div>
  );
};

export default ShareMedicalRecord;
