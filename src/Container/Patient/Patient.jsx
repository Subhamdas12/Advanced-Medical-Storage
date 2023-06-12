import React from "react";
import "./patient.css";
import {
  CurrentEMRAccess,
  PersonalInformation,
  ShareMedicalRecord,
} from "../../Components";
const Patient = () => {
  return (
    <div>
      <PersonalInformation />
      <ShareMedicalRecord />
      <CurrentEMRAccess />
    </div>
  );
};

export default Patient;
