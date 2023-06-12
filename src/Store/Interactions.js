import { ethers } from "ethers";
import MEDICALSTORAGE_ABI from "../Abis/MedicalStorage.json";
export const loadProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });
  return connection;
};
export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });
  return chainId;
};
export const loadAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);
  dispatch({ type: "ACCOUNT_LOADED", account });
  return account;
};
export const loadMedicalStorage = (provider, address, dispatch) => {
  let medicalStorage;
  medicalStorage = new ethers.Contract(address, MEDICALSTORAGE_ABI, provider);
  dispatch({ type: "MEDICALSTORAGE_LOADED", medicalStorage });
  return medicalStorage;
};
export const registerUser = async (
  name,
  details,
  problem,
  type,
  provider,
  medicalStorage,
  dispatch
) => {
  let transaction;
  dispatch({ type: "REGISTER_REQUEST" });
  try {
    const signer = await provider.getSigner();
    if (type === "patient") {
      transaction = await medicalStorage
        .connect(signer)
        .addPatient(name, details, problem);
      await transaction.wait();
    } else {
      transaction = await medicalStorage
        .connect(signer)
        .registerDoctor(name, details);
      await transaction.wait();
    }
  } catch (error) {
    dispatch({ type: "REGISTER_FAIL" });
  }
};

export const checkPatientAlreadyExists = async (provider, medicalStorage) => {
  const signer = await provider.getSigner();
  const exists = await medicalStorage.connect(signer).addressPatientExists();
  return exists;
};
export const checkDoctorAlreadyExists = async (provider, medicalStorage) => {
  const signer = await provider.getSigner();
  const exists = await medicalStorage.connect(signer).addressDoctorExists();
  return exists;
};
export const getPatientDetails = async (medicalStorage, address) => {
  let details = await medicalStorage.getPatientDetails(address);
  return details;
};

export const getDoctorList = async (medicalStorage, address) => {
  const doctorList = await medicalStorage.getDoctorList(address);
  return doctorList;
};

export const getDoctorDetails = async (medicalStorage, doctor) => {
  const doctorDetails = await medicalStorage.getDoctorDetails(doctor);
  return doctorDetails;
};
export const getDoctorDiagnosis = async (provider, medicalStorage, doctor) => {
  const signer = await provider.getSigner();
  const diagnosis = await medicalStorage
    .connect(signer)
    .getDoctorDiagnosis(doctor);
  return diagnosis;
};
export const getAllDoctorNameAddresses = async (medicalStorage) => {
  const details = await medicalStorage.getAllDoctorsNamesAddresses();

  return details;
};

export const addDoctor = async (
  provider,
  doctorAddress,
  medicalStorage,
  dispatch
) => {
  let transaction;
  dispatch({ type: "ADD_DOCTOR_INITIALIZED" });
  try {
    const signer = await provider.getSigner();

    transaction = await medicalStorage
      .connect(signer)
      .addDoctor(doctorAddress, { gasLimit: 300000 });
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "ADD_DOCTOR_FAIL" });
  }
};
export const revokeDoctorAccess = async (
  provider,
  doctorAddress,
  medicalStorage,
  dispatch
) => {
  let transaction;
  dispatch({ type: "REVOKE_DOCTOR_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await medicalStorage
      .connect(signer)
      .revokeDoctorAccess(doctorAddress);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "REVOKE_DOCTOR_FAIL" });
  }
};

export const getPatientListForDoctor = async (address, medicalStorage) => {
  const patientList = await medicalStorage.getPatientListForDoctor(address);
  return patientList;
};
export const provideDiagnosis = async (
  patientAddress,
  provider,
  medicalStorage,
  diagnosis,
  medicineInformation,
  dispatch
) => {
  let transaction;
  dispatch({ type: "PROVIDE_DIAGNOSIS_INITIALIZED" });
  try {
    const signer = await provider.getSigner();
    transaction = await medicalStorage
      .connect(signer)
      .provideDiagnosis(patientAddress, diagnosis, medicineInformation);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "PROVIDE_DIAGNOSIS_FAIL" });
  }
};

export const getPreviousDiagnosis = async (
  patinetAddress,
  provider,
  medicalStorage
) => {
  const signer = await provider.getSigner();
  let patientDiagnosis = await medicalStorage
    .connect(signer)
    .getPreviousDiagnosis(patinetAddress);
  return patientDiagnosis;
};

export const subscribeToEvents = async (medicalStorage, dispatch) => {
  medicalStorage.on("MedicalStorage__AddDoctor", (patient, doctor, event) => {
    dispatch({ type: "ADD_DOCTOR_SUCCESS", event });
  });
  medicalStorage.on(
    "MedicalStorage__RevokeDoctorAccess",
    (patient, doctor, event) => {
      dispatch({ type: "REVOKE_DOCTOR_SUCCESS", event });
    }
  );
  medicalStorage.on(
    "MedicalStorage__ProvideDiagnosis",
    (patient, doctor, diagnosis, medicineInformation, event) => {
      dispatch({ type: "PROVIDE_DIAGNOSIS_SUCCESS", event });
    }
  );
};
