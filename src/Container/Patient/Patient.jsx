import React from "react";
import "./patient.css";
import {
  CurrentEMRAccess,
  PersonalInformation,
  ShareMedicalRecord,
} from "../../Components";
if (window.performance) {
  if (performance.navigation.type === 1) {
    window.location.replace("/");
  }
}
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
