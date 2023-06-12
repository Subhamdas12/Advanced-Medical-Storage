import React from "react";
import "./currentEMRAccess.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { getDoctorList, getDoctorDetails } from "../../Store/Interactions";
import CurrentEMRBody from "./CurrentEMRBody";
const CurrentEMRAccess = () => {
  const provider = useSelector((state) => state.Provider.connection);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const account = useSelector((state) => state.Provider.account);
  const [publicKeys, setPublicKeys] = useState(null);
  const transferInProgress = useSelector(
    (state) => state.MedicalStorage.transferInProgress
  );
  useEffect(() => {
    const fetchDetails = async () => {
      const keys = await getDoctorList(medicalStorage, account);
      setPublicKeys(keys);
    };
    if (medicalStorage && provider) {
      fetchDetails();
    }
  }, [transferInProgress]);
  return (
    <div className="currentEMRAccess">
      <h2>Current EMR Access holder</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th>Public Key</th>
            <th>Revoke Access</th>
          </tr>
        </thead>
        <tbody>
          {publicKeys &&
            publicKeys.map((orders, index) => (
              <tr key={index}>
                <CurrentEMRBody orders={orders} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CurrentEMRAccess;
