import React, { useEffect, useState } from "react";
import "./personalInformationDoctor.css";
import { useSelector } from "react-redux";
import { getDoctorDetails } from "../../Store/Interactions";
const PersonalInformationDoctor = () => {
  const account = useSelector((state) => state.Provider.account);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const [detail, setDetail] = useState(null);
  useEffect(() => {
    const fetchDetails = async () => {
      const details = await getDoctorDetails(medicalStorage, account);
      setDetail(details);
    };
    if (medicalStorage && account) {
      fetchDetails();
    }
  });
  return (
    <div className="personalInformationDoctor">
      <h2>Personal Information</h2>
      <p>
        <strong>Name:</strong> {detail && detail[0]}
      </p>
      <p>
        <strong>Details:</strong> {detail && detail[1]}
      </p>
    </div>
  );
};

export default PersonalInformationDoctor;
