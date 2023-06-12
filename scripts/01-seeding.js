const { ethers } = require("hardhat");
const config = require("../src/config.json");
async function main() {
  const accounts = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();
  console.log(`ChainId is ${chainId}`);
  const medical = await ethers.getContractAt(
    "MedicalStorage",
    config[chainId].MedicalStorage.address
  );
  console.log(`Contract fetched with address ${medical.address}`);
  console.log(`Adding a patient`);
  let transaction;
  transaction = await medical
    .connect(accounts[0])
    .addPatient("Aditya", 32, "I am ill");
  await transaction.wait();
  transaction = await medical
    .connect(accounts[1])
    .registerDoctor("Shyam", "MBBS");
  await transaction.wait();
  console.log(`Doctor registerd`);
  transaction = await medical
    .connect(accounts[0])
    .addDoctor(accounts[1].address);
  await transaction.wait();
  console.log("Doctor added");
  transaction = await medical
    .connect(accounts[1])
    .provideDiagnosis(accounts[0].address, "Take rest", "Take medicine");
  console.log("Doctor provide the diagnosis");
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
