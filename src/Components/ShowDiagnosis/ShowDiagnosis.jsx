import React, { useEffect, useState } from "react";
import "./showDiagnosis.css";
import { useSelector } from "react-redux";
import { getDoctorDetails, getDoctorDiagnosis } from "../../Store/Interactions";
const ShowDiagnosis = ({ doctor }) => {
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const provider = useSelector((state) => state.Provider.connection);
  const [details, setDetails] = useState(null);
  const [diagnosis, setDiagnosis] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getDoctorDetails(medicalStorage, doctor);
      const diagnosis = await getDoctorDiagnosis(
        provider,
        medicalStorage,
        doctor
      );
      setDetails(details);
      setDiagnosis(diagnosis);
    };
    if (medicalStorage && doctor) {
      fetchDetails();
    }
  }, [medicalStorage, doctor]);
  return (
    <div className="ShowDiagnosis">
      <div className="doctorDetails">
        <p>
          <strong>Name : </strong>
          {details && details[0]}
        </p>
        <p>
          <strong>Details : </strong>
          {details && details[1]}
        </p>
        <p>
          <strong>Public key : </strong>
          {doctor}
        </p>
      </div>
      <div className="doctorDiagnosis">
        <p>
          <strong>Diagnosis : </strong>
          {diagnosis && diagnosis[0]}
        </p>
        <p>
          <strong>Medicine information : </strong>
          {diagnosis && diagnosis[1]}
        </p>
      </div>
    </div>
  );
};

export default ShowDiagnosis;
