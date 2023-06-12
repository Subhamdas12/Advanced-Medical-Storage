import React from "react";
import "./doctor.css";
import { AccessibleEMRs, PersonalInformationDoctor } from "../../Components";
const Doctor = () => {
  return (
    <div>
      <PersonalInformationDoctor />
      <AccessibleEMRs />
    </div>
  );
};

export default Doctor;
