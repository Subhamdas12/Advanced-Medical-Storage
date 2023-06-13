import React from "react";
import "./doctor.css";
import { AccessibleEMRs, PersonalInformationDoctor } from "../../Components";
if (window.performance) {
  if (performance.navigation.type === 1) {
    window.location.replace("/");
  }
}
const Doctor = () => {
  return (
    <div>
      <PersonalInformationDoctor />
      <AccessibleEMRs />
    </div>
  );
};

export default Doctor;
