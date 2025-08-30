# IPFS Integration Guide for MedChainDb

## 🗂️ **How IPFS Works in MedChainDb**

### **Architecture Overview:**
```
Patient Uploads File → IPFS (stores file) → Smart Contract (stores CID + metadata)
Provider Requests Access → Smart Contract (checks permissions) → IPFS (retrieves file)
```

### **Data Flow:**

1. **File Upload Process:**
   - Patient selects file (PDF, JPG, PNG)
   - File is uploaded to IPFS
   - IPFS returns a Content Identifier (CID)
   - Smart contract stores: CID, file name, file type, timestamp, patient address
   - Access permissions are managed on-chain

2. **File Access Process:**
   - Provider requests to view a record
   - Smart contract checks if provider has access permission
   - If authorized, frontend fetches file from IPFS using the CID
   - File is displayed or downloaded

## 🔧 **Implementation Details**

### **IPFS Service (`/src/lib/ipfs.js`)**
```javascript
// Upload file to IPFS
const ipfsHash = await ipfsService.uploadFile(file)

// Retrieve file from IPFS
const fileBlob = await ipfsService.getFile(ipfsHash)

// Get file info
const fileInfo = await ipfsService.getFileInfo(ipfsHash)
```

### **Smart Contract Service (`/src/lib/contract.js`)**
```javascript
// Store record metadata on blockchain
const txHash = await contractService.uploadRecord(
  patientAddress,
  ipfsHash,
  fileName,
  fileType
)

// Get patient's records
const records = await contractService.getPatientRecords(patientAddress)

// Grant access to provider
await contractService.grantAccess(patientAddress, providerAddress, recordId)
```

### **File Upload Component (`/src/components/FileUpload.jsx`)**
- Drag & drop file selection
- File validation (type, size)
- Progress tracking during upload
- Two-step process: IPFS → Blockchain

### **IPFS Viewer Component (`/src/components/IPFSViewer.jsx`)**
- Modal for viewing files from IPFS
- Download functionality
- Error handling for IPFS failures
- File type detection and appropriate viewing

## 📦 **Required Dependencies**

To implement real IPFS functionality, you'll need to install:

```bash
npm install ipfs-http-client
# or
npm install ipfs-core
```

## 🔐 **Security Considerations**

### **File Encryption (Optional):**
```javascript
// Encrypt file before uploading to IPFS
const encryptedFile = await encryptFile(file, patientPrivateKey)

// Decrypt file after retrieving from IPFS
const decryptedFile = await decryptFile(encryptedFile, patientPrivateKey)
```

### **Access Control:**
- Only authorized providers can access files
- All access events are logged on blockchain
- Patients can revoke access at any time

## 🌐 **IPFS Network Options**

### **Public IPFS:**
- Files are publicly accessible via CID
- Relies on network nodes to pin files
- Good for public data, not ideal for private health records

### **Private IPFS Network:**
- Set up your own IPFS cluster
- Better control over data persistence
- More suitable for healthcare data

### **IPFS Pin Services:**
- Use services like Pinata, Infura, or Web3.Storage
- Guaranteed file persistence
- Better performance and reliability

## 🚀 **Next Steps for Implementation**

1. **Install IPFS Client:**
   ```bash
   npm install ipfs-http-client
   ```

2. **Configure IPFS Endpoint:**
   ```javascript
   import { create } from 'ipfs-http-client'
   
   const ipfs = create({
     url: 'https://ipfs.infura.io:5001/api/v0',
     // or your own IPFS node
   })
   ```

3. **Update IPFS Service:**
   - Replace mock functions with real IPFS calls
   - Add error handling and retry logic
   - Implement file encryption if needed

4. **Smart Contract Integration:**
   - Deploy your MedChainDb contract
   - Update contract service with real contract address
   - Implement proper error handling

5. **Testing:**
   - Test file uploads to IPFS
   - Verify file retrieval works
   - Test access control mechanisms

## 📊 **Data Structure**

### **On-Chain (Smart Contract):**
```solidity
struct Record {
    string ipfsHash;        // IPFS CID
    string fileName;        // Original file name
    string fileType;        // MIME type
    uint256 uploadDate;     // Timestamp
    address patient;        // Patient address
}

mapping(address => Record[]) patientRecords;
mapping(address => mapping(address => bool)) accessPermissions;
```

### **Off-Chain (IPFS):**
- Raw file content (encrypted or unencrypted)
- File metadata (size, type, etc.)
- Accessible via IPFS CID

## 🔍 **Monitoring & Analytics**

- Track IPFS upload/download success rates
- Monitor file access patterns
- Log all blockchain transactions
- Monitor IPFS node health

## 💡 **Best Practices**

1. **File Validation:** Always validate file types and sizes before upload
2. **Error Handling:** Implement proper error handling for IPFS failures
3. **Progress Tracking:** Show upload progress to users
4. **Retry Logic:** Implement retry mechanisms for failed uploads
5. **Caching:** Cache frequently accessed files locally
6. **Backup:** Consider backing up critical files to multiple IPFS nodes

This architecture ensures that health records are stored securely and accessibly while maintaining patient privacy and control over their data.
