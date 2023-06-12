import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPatientDetails,
  getPreviousDiagnosis,
  provideDiagnosis,
} from "../../Store/Interactions";

const AccessEMRsBody = ({ patient }) => {
  const [viewRecords, setViewRecords] = useState(false);
  const medicalStorage = useSelector((state) => state.MedicalStorage.contract);
  const provider = useSelector((state) => state.Provider.connection);
  const transferInProgress = useSelector(
    (state) => state.MedicalStorage.transferinProgress
  );
  const dispatch = useDispatch();
  const [detail, setDetail] = useState(null);
  const [diagnosis, setDiagnosis] = useState(0);
  const [medicineInformation, setMedicineInformation] = useState(0);
  const [previousDiagnosis, setPreviousDiagnosis] = useState(0);
  const precision = 100000;

  const inputStyle = {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
    width: "100%",
    fontSize: "16px",
    marginBottom: "10px",
  };

  const buttonStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
    textDecoration: "none",
    margin: "4px 2px",
    transitionDuration: "0.4s",
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    await provideDiagnosis(
      patient,
      provider,
      medicalStorage,
      diagnosis,
      medicineInformation,
      dispatch
    );
    setDiagnosis(0);
    setMedicineInformation(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      let detail = await getPatientDetails(medicalStorage, patient);
      let previous_diagnosis = await getPreviousDiagnosis(
        patient,
        provider,
        medicalStorage
      );
      console.log(previous_diagnosis);
      setPreviousDiagnosis(previous_diagnosis);
      setDetail(detail);
    };
    if (medicalStorage && patient) {
      fetchData();
    }
  }, [transferInProgress]);
  return (
    <>
      <td>
        {viewRecords ? (
          <div className="">
            <p>
              <strong>Name : </strong>
              {detail && detail[0]}
            </p>

            <p>
              <strong>Age : </strong>
              {detail && (detail[1] / precision) * precision}
            </p>
            <p>
              <strong>Problem : </strong>
              {detail && detail[2]}
            </p>
          </div>
        ) : (
          detail && detail[0]
        )}
      </td>
      <td>
        {viewRecords ? (
          <div>
            {patient}
            <form onSubmit={submitHandler}>
              <p>
                <strong>Previous Diagnosis : </strong>
                {previousDiagnosis && previousDiagnosis[0]}
              </p>
              <p>
                <strong>Previous Medicines : </strong>{" "}
                {previousDiagnosis && previousDiagnosis[1]}
              </p>
              <p>
                <strong>Give New Diagnosis : </strong>
              </p>
              <input
                type="text"
                style={inputStyle}
                placeholder="Home Quarentine"
                onChange={(e) => setDiagnosis(e.target.value)}
                value={diagnosis === 0 ? "" : diagnosis}
              />
              <p>
                <strong>Give New Medicine : </strong>
              </p>
              <input
                type="text"
                style={inputStyle}
                placeholder="Covid Shield"
                onChange={(e) => setMedicineInformation(e.target.value)}
                value={medicineInformation === 0 ? "" : medicineInformation}
              />
              <button type="submit" style={buttonStyle}>
                Submit
              </button>
            </form>
          </div>
        ) : (
          patient
        )}
      </td>
      <td>
        {viewRecords}
        <button
          class="revokeBtn"
          style={viewRecords ? { backgroundColor: "red" } : null}
          onClick={() => setViewRecords(!viewRecords)}
        >
          {viewRecords ? "Hide Records" : "View Records"}
        </button>
      </td>
    </>
  );
};

export default AccessEMRsBody;
