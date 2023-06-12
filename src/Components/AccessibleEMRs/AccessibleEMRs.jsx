import React from "react";
import "./accessibleEMRs.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getPatientListForDoctor } from "../../Store/Interactions";
import { useState } from "react";
import AccessEMRsBody from "./AccessEMRsBody";
const AccessibleEMRs = () => {
  const account = useSelector((state) => state.Provider.account);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const [patientLists, setPatientLists] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const patientList = await getPatientListForDoctor(
        account,
        medicalStorage
      );
      console.log(patientList);
      setPatientLists(patientList);
    };
    if (account && medicalStorage) {
      fetchData();
    }
  }, [account, medicalStorage]);
  return (
    <div className="accessibleEMRs">
      <h2>Access EMRs</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Public Key</th>
            <th>View Records</th>
          </tr>
        </thead>
        <tbody>
          {patientLists &&
            patientLists.map((patient, index) => (
              <tr>
                <AccessEMRsBody patient={patient} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessibleEMRs;
