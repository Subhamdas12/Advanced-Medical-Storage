import React, { useEffect } from "react";
import "./currentEMRBody.css";
import { useDispatch, useSelector } from "react-redux";
import { getDoctorDetails, revokeDoctorAccess } from "../../Store/Interactions";
import { useState } from "react";
const CurrentEMRBody = ({ orders }) => {
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const provider = useSelector((state) => state.Provider.connection);
  const dispatch = useDispatch();
  const [details, setDetails] = useState(null);
  const revokeHandler = async () => {
    if (provider && orders && medicalStorage) {
      await revokeDoctorAccess(provider, orders, medicalStorage, dispatch);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const detail = await getDoctorDetails(medicalStorage, orders);
      setDetails(detail);
    };
    if (medicalStorage && orders) {
      fetchDetails();
    }
  }, [orders]);

  return (
    <>
      <td>{details && details[0]}</td>
      <td>{details && details[1]}</td>
      <td>{orders.slice(0, 5) + "...." + orders.slice(38, 42)}</td>
      <td>
        <button className="revokeBtn" onClick={revokeHandler}>
          Revoke
        </button>
      </td>
    </>
  );
};

export default CurrentEMRBody;
