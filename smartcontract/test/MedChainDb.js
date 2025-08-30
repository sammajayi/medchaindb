const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MedChainDb", function () {
  let MedChainDb;
  let medChainDb;
  let owner, patient, provider, emergencyProvider, other;

  beforeEach(async function () {
    [owner, patient, provider, emergencyProvider, other] = await ethers.getSigners();
    MedChainDb = await ethers.getContractFactory("MedChainDb");
    medChainDb = await MedChainDb.deploy();
    // No need to wait for deployTransaction
  });

  it("Should set the correct owner", async function () {
    expect(await medChainDb.owner()).to.equal(owner.address);
  });

  it("Should return correct version", async function () {
    expect(await medChainDb.getVersion()).to.equal("MedChainDb v1.0.0");
  });

  it("Should allow a patient to upload a record", async function () {
    const ipfsCID = "QmTestCID123";
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    await medChainDb.connect(patient).uploadRecord(ipfsCID, fileName, fileType, fileSize, recordHash, description);

    const records = await medChainDb.getPatientRecords(patient.address);
    expect(records.length).to.equal(1);

    // Patient should be able to access their own record details
    const recordDetails = await medChainDb.connect(patient).getRecordDetails(records[0]);
    expect(recordDetails.ipfsCID).to.equal(ipfsCID);
    expect(recordDetails.fileName).to.equal(fileName);
  });

  it("Should reject empty IPFS CID", async function () {
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    await expect(
      medChainDb.connect(patient).uploadRecord("", fileName, fileType, fileSize, recordHash, description)
    ).to.be.revertedWith("IPFS CID cannot be empty");
  });

  it("Should allow patient to grant and revoke access", async function () {
    const ipfsCID = "QmTestCID123";
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    // Upload record
    await medChainDb.connect(patient).uploadRecord(ipfsCID, fileName, fileType, fileSize, recordHash, description);
    const recordId = (await medChainDb.getPatientRecords(patient.address))[0];

    // Grant access
    await medChainDb.connect(patient).grantAccess(provider.address, recordId);
    expect(await medChainDb.checkAccess(patient.address, provider.address, recordId)).to.equal(true);

    // Revoke access
    await medChainDb.connect(patient).revokeAccess(provider.address, recordId);
    expect(await medChainDb.checkAccess(patient.address, provider.address, recordId)).to.equal(false);
  });

  it("Should not allow non-patient to grant access", async function () {
    const ipfsCID = "QmTestCID123";
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    // Upload record
    await medChainDb.connect(patient).uploadRecord(ipfsCID, fileName, fileType, fileSize, recordHash, description);
    const recordId = (await medChainDb.getPatientRecords(patient.address))[0];

    await expect(
      medChainDb.connect(other).grantAccess(provider.address, recordId)
    ).to.be.revertedWith("Only record owner can perform this action");
  });

  it("Should allow emergency provider to bypass access control", async function () {
    const ipfsCID = "QmTestCID123";
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    // Upload record
    await medChainDb.connect(patient).uploadRecord(ipfsCID, fileName, fileType, fileSize, recordHash, description);
    const recordId = (await medChainDb.getPatientRecords(patient.address))[0];

    // Add emergency provider
    await medChainDb.connect(owner).addEmergencyProvider(emergencyProvider.address);

    // Emergency provider should have access without explicit grant
    const cid = await medChainDb.connect(emergencyProvider).getRecordCID(recordId);
    expect(cid).to.equal(ipfsCID);
  });

  it("Should allow owner to transfer ownership", async function () {
    await medChainDb.connect(owner).transferOwnership(other.address);
    expect(await medChainDb.owner()).to.equal(other.address);
  });

  it("Should allow patient to delete record", async function () {
    const ipfsCID = "QmTestCID123";
    const fileName = "file.pdf";
    const fileType = "pdf";
    const fileSize = 1024;
    const recordHash = ethers.keccak256(ethers.toUtf8Bytes("Test record"));
    const description = "Test record";

    await medChainDb.connect(patient).uploadRecord(ipfsCID, fileName, fileType, fileSize, recordHash, description);
    const recordId = (await medChainDb.getPatientRecords(patient.address))[0];

    await medChainDb.connect(patient).deleteRecord(recordId);

    await expect(
      medChainDb.connect(patient).getRecordDetails(recordId)
    ).to.be.revertedWith("Record has been deleted");
  });
});