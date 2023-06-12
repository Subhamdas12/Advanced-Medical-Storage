const { ethers } = require("hardhat");
const { expect } = require("chai");
describe("MedicalStorage", () => {
  let transactionResponse,
    transactionReceipt,
    medical,
    user0,
    user1,
    user2,
    user3;
  beforeEach(async () => {
    const Medical = await ethers.getContractFactory("MedicalStorage");
    const accounts = await ethers.getSigners();
    user0 = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    medical = await Medical.connect(user0).deploy();
  });
  describe("Register doctor", () => {
    beforeEach(async () => {
      transactionResponse = await medical
        .connect(user1)
        .registerDoctor("Shyam", "MBBS second year fail");
      transactionReceipt = await transactionResponse.wait();
    });
    it("The doctor name and details are same", async () => {
      const [name, details] = await medical.getDoctorDetails(user1.address);
      expect(name).to.equal("Shyam");

      expect(details).to.equal("MBBS second year fail");
    });
    it("Emits a Register doctor image", async () => {
      const event = await transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalStorage__RegisterDoctor");
      const args = event.args;
      expect(args.name).to.equal("Shyam");
      expect(args.details).to.equal("MBBS second year fail");
    });
  });
  describe("Add patient", () => {
    beforeEach(async () => {
      transactionResponse = await medical
        .connect(user0)
        .addPatient("Aditya", 32, "I am ill");
      transactionReceipt = await transactionResponse.wait();
    });
    it("The patient is added ", async () => {
      const [name, age, problem] = await medical.getPatientDetails(
        user0.address
      );
      expect(name).to.equal("Aditya");
      expect(age).to.equal(32);
      expect(problem).to.equal("I am ill");
    });
    it("Emits a add patient event", async () => {
      const event = await transactionReceipt.events[0];
      expect(event.event).to.equal("MedicalStorage__AddPatient");
      const args = event.args;
      expect(args.name).to.equal("Aditya");
      expect(args.age).to.equal(32);
      expect(args.problem).to.equal("I am ill");
    });
  });
  describe("Add Doctor for the patient", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
      });
      it("The doctor is added to the patient list", async () => {
        const doctor = await medical.getDoctorList(user0.address);
        expect(doctor[0]).to.equal(user1.address);
      });
      it("The patient is also added to the doctors list", async () => {
        const patients = await medical.getPatientListForDoctor(user1.address);
        expect(patients[0]).to.equal(user0.address);
      });
      it("It emits a add doctor event", async () => {
        const event = await transactionReceipt.events[0];
        expect(event.event).to.equal("MedicalStorage__AddDoctor");
        const args = event.args;
        expect(args.patient).to.equal(user0.address);
        expect(args.doctor).to.equal(user1.address);
      });
    });
    describe("Failure", () => {
      it("If the patient and the doctor address are same", async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        await expect(
          medical.connect(user0).addDoctor(user0.address)
        ).to.be.revertedWith(
          "The patient address cannot be equal to the doctors address"
        );
      });
      it("If the doctor already exists", async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
        await expect(
          medical.connect(user0).addDoctor(user1.address)
        ).to.be.revertedWith("Doctor already exists in your list");
      });
    });
  });
  describe("Revoke Doctor access", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user2.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user3.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .revokeDoctorAccess(user2.address);
        transactionReceipt = await transactionResponse.wait();
      });
      it("The doctor is removed from the patient list", async () => {
        expect(
          await medical.checkDoctorAlreadyExists(user0.address, user2.address)
        ).to.equal(false);
      });
      it("The patient is also deleted from the doctors patient list", async () => {
        expect(
          await medical.checkPatientAlreadyExists(user0.address, user2.address)
        ).to.equal(false);
      });
      it("Emits a revoke doctor access event", async () => {
        const event = await transactionReceipt.events[0];
        expect(event.event).to.equal("MedicalStorage__RevokeDoctorAccess");
        const args = event.args;
        expect(args.patient).to.equal(user0.address);
        expect(args.doctor).to.equal(user2.address);
      });
    });
    describe("Failure", () => {
      it("Reverts if the doctor is not there", async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
        await expect(
          medical.connect(user0).revokeDoctorAccess(user2.address)
        ).to.be.revertedWith("Doctor not found");
      });
    });
  });
  describe("Provide Diagnosis", () => {
    describe("Success", () => {
      beforeEach(async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user2.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user3.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user1)
          .provideDiagnosis(
            user0.address,
            "Take rest",
            "Take calpol or paracitemol"
          );
        transactionReceipt = await transactionResponse.wait();
      });
      it("The diagnosis is done", async () => {
        const [diagnosis, medicineInformation] =
          await medical.getDoctorDiagnosis(user1.address);
        expect(diagnosis).to.equal("Take rest");
        expect(medicineInformation).to.equal("Take calpol or paracitemol");
      });
      it("It emits a provide diagnosis event", async () => {
        const event = await transactionReceipt.events[0];
        expect(event.event).to.equal("MedicalStorage__ProvideDiagnosis");
        const args = event.args;
        expect(args.patient).to.equal(user0.address);
        expect(args.doctor).to.equal(user1.address);
        expect(args.diagnosis).to.equal("Take rest");
        expect(args.medicineInformation).to.equal("Take calpol or paracitemol");
      });
    });
    describe("Failure", () => {
      it("The diagnosis cant be done by an unauthorized doctor", async () => {
        transactionResponse = await medical
          .connect(user0)
          .addPatient("Aditya", 32, "I am ill");
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user1.address);
        transactionReceipt = await transactionResponse.wait();
        transactionResponse = await medical
          .connect(user0)
          .addDoctor(user2.address);
        transactionReceipt = await transactionResponse.wait();
        await expect(
          medical
            .connect(user1)
            .provideDiagnosis(
              user3.address,
              "Take rest",
              "Take calpol or paracitemol"
            )
        ).to.be.revertedWith("Doctor not authorized.");
      });
    });
  });
  it("Checking if the address exists functions are working or not", async () => {
    transactionResponse = await medical
      .connect(user0)
      .addPatient("Aditya", 32, "I am ill");
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical.connect(user0).addDoctor(user1.address);
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical.connect(user0).addDoctor(user2.address);
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical.connect(user0).addDoctor(user3.address);
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical
      .connect(user1)
      .registerDoctor("Shyam", "MBBS second year fail");
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical
      .connect(user2)
      .registerDoctor("Shyam", "MBBS second year fail");
    transactionReceipt = await transactionResponse.wait();
    transactionResponse = await medical
      .connect(user3)
      .registerDoctor("Shyam", "MBBS second year fail");
    transactionReceipt = await transactionResponse.wait();
    expect(await medical.addressDoctorExists(user1.address)).to.equal(true);
    expect(await medical.addressDoctorExists(user0.address)).to.equal(false);
    expect(await medical.addressPatientExists(user0.address)).to.equal(true);
    expect(await medical.addressPatientExists(user1.address)).to.equal(false);
    expect(await medical.addressPatientExists(user2.address)).to.equal(false);
  });
});
