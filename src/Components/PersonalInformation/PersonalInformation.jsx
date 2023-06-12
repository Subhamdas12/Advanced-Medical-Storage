import React, { useEffect, useState } from "react";
import "./personalInformation.css";
import { getDoctorList, getPatientDetails } from "../../Store/Interactions";
import { useSelector } from "react-redux";
import ShowDiagnosis from "../ShowDiagnosis/ShowDiagnosis";
const PersonalInformation = () => {
  const account = useSelector((state) => state.Provider.account);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const transferInProgress = useSelector(
    (state) => state.MedicalStorage.transferInProgress
  );
  const [details, setDetails] = useState(null);
  const [doctorList, setDoctorList] = useState(null);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getPatientDetails(medicalStorage, account);
      const doctorList = await getDoctorList(medicalStorage, account);
      setDoctorList(doctorList);
      setDetails(details);
    };
    if (medicalStorage && account) {
      fetchDetails();
    }
  }, [medicalStorage, account, transferInProgress]);
  return (
    <div className="personalInformation">
      <h2>Personal Information</h2>
      <p>
        <strong>Name:</strong> {details && details[0]}
      </p>
      <p>
        <strong>Age:</strong>
        {details && Math.round(details[1] * 100000) / 100000}
      </p>
      <p>
        <strong>Problem:</strong> {details && details[2]}
      </p>
      <button
        className="btn"
        style={showDiagnosis ? { backgroundColor: "red" } : null}
        onClick={() => setShowDiagnosis(!showDiagnosis)}
      >
        {showDiagnosis ? "Hide Diagnosis" : "Show Diagnosis"}
      </button>
      {showDiagnosis ? (
        <div>
          {doctorList &&
            doctorList.map((doctors, index) => (
              <ShowDiagnosis doctor={doctors} key={index} />
            ))}
        </div>
      ) : null}
    </div>
  );
};

export default PersonalInformation;
