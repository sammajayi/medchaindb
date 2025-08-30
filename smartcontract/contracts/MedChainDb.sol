// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MedChainDb - Decentralized Health Records Management
 * @dev Smart contract for managing medical record metadata and access permissions
 * @notice This contract stores only metadata and permissions, actual files are stored on IPFS
 */
contract MedChainDb {
    address public owner;
    uint256 private recordCounter;

    struct MedicalRecord {
        uint256 recordId;
        string ipfsCID;
        string fileName;
        string fileType;
        uint256 fileSize;
        bytes32 recordHash;
        address patient;
        uint256 timestamp;
        bool isActive;
        string description;
    }

    mapping(uint256 => MedicalRecord) public medicalRecords;
    mapping(address => uint256[]) public patientRecords;
    mapping(address => mapping(address => mapping(uint256 => bool)))
        public accessPermissions;
    mapping(address => uint256[]) public providerAccessibleRecords;
    mapping(address => bool) public emergencyProviders;
    mapping(uint256 => uint256) public recordAccessCount;

    event RecordUploaded(
        uint256 indexed recordId,
        address indexed patient,
        string ipfsCID,
        string fileName,
        uint256 timestamp
    );
    event AccessGranted(
        uint256 indexed recordId,
        address indexed patient,
        address indexed provider,
        uint256 timestamp
    );
    event AccessRevoked(
        uint256 indexed recordId,
        address indexed patient,
        address indexed provider,
        uint256 timestamp
    );
    event RecordAccessed(
        uint256 indexed recordId,
        address indexed provider,
        address indexed patient,
        uint256 timestamp
    );
    event RecordDeleted(
        uint256 indexed recordId,
        address indexed patient,
        uint256 timestamp
    );
    event EmergencyProviderAdded(address indexed provider, uint256 timestamp);
    event EmergencyProviderRemoved(address indexed provider, uint256 timestamp);

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only contract owner can perform this action"
        );
        _;
    }

    modifier onlyPatient(uint256 _recordId) {
        require(
            medicalRecords[_recordId].patient == msg.sender,
            "Only record owner can perform this action"
        );
        _;
    }

    modifier recordExists(uint256 _recordId) {
        require(
            _recordId > 0 && _recordId <= recordCounter,
            "Record does not exist"
        );
        require(medicalRecords[_recordId].isActive, "Record has been deleted");
        _;
    }

    modifier hasAccess(uint256 _recordId) {
        address patient = medicalRecords[_recordId].patient;
        require(
            msg.sender == patient ||
                accessPermissions[patient][msg.sender][_recordId] ||
                emergencyProviders[msg.sender],
            "Access denied"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        recordCounter = 0;
    }

    function uploadRecord(
        string memory _ipfsCID,
        string memory _fileName,
        string memory _fileType,
        uint256 _fileSize,
        bytes32 _recordHash,
        string memory _description
    ) external returns (uint256) {
        require(bytes(_ipfsCID).length > 0, "IPFS CID cannot be empty");
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(bytes(_fileType).length > 0, "File type cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");

        recordCounter++;
        uint256 newRecordId = recordCounter;

        medicalRecords[newRecordId] = MedicalRecord({
            recordId: newRecordId,
            ipfsCID: _ipfsCID,
            fileName: _fileName,
            fileType: _fileType,
            fileSize: _fileSize,
            recordHash: _recordHash,
            patient: msg.sender,
            timestamp: block.timestamp,
            isActive: true,
            description: _description
        });

        patientRecords[msg.sender].push(newRecordId);

        emit RecordUploaded(
            newRecordId,
            msg.sender,
            _ipfsCID,
            _fileName,
            block.timestamp
        );

        return newRecordId;
    }

    function getPatientRecords(
        address _patient
    ) external view returns (uint256[] memory) {
        return patientRecords[_patient];
    }

    function getRecordDetails(
        uint256 _recordId
    )
        external
        view
        recordExists(_recordId)
        hasAccess(_recordId)
        returns (MedicalRecord memory)
    {
        return medicalRecords[_recordId];
    }

    function deleteRecord(
        uint256 _recordId
    ) external recordExists(_recordId) onlyPatient(_recordId) {
        medicalRecords[_recordId].isActive = false;
        emit RecordDeleted(_recordId, msg.sender, block.timestamp);
    }

    function grantAccess(
        address _provider,
        uint256 _recordId
    ) external recordExists(_recordId) onlyPatient(_recordId) {
        require(_provider != address(0), "Invalid provider address");
        require(_provider != msg.sender, "Cannot grant access to yourself");
        require(
            !accessPermissions[msg.sender][_provider][_recordId],
            "Access already granted"
        );

        accessPermissions[msg.sender][_provider][_recordId] = true;
        providerAccessibleRecords[_provider].push(_recordId);

        emit AccessGranted(_recordId, msg.sender, _provider, block.timestamp);
    }

    function revokeAccess(
        address _provider,
        uint256 _recordId
    ) external recordExists(_recordId) onlyPatient(_recordId) {
        require(
            accessPermissions[msg.sender][_provider][_recordId],
            "Access not granted"
        );
        accessPermissions[msg.sender][_provider][_recordId] = false;
        _removeFromProviderRecords(_provider, _recordId);
        emit AccessRevoked(_recordId, msg.sender, _provider, block.timestamp);
    }

    function checkAccess(
        address _patient,
        address _provider,
        uint256 _recordId
    ) external view recordExists(_recordId) returns (bool) {
        return
            accessPermissions[_patient][_provider][_recordId] ||
            emergencyProviders[_provider];
    }

    function getAccessibleRecords(
        address _provider
    ) external view returns (uint256[] memory) {
        return providerAccessibleRecords[_provider];
    }

    // ===== NEW: Read-only fetch for CID =====
    function getRecordCID(
        uint256 _recordId
    )
        external
        view
        recordExists(_recordId)
        hasAccess(_recordId)
        returns (string memory)
    {
        return medicalRecords[_recordId].ipfsCID;
    }

    // ===== NEW: Log access event (optional state change) =====
    function logRecordAccess(
        uint256 _recordId
    ) external recordExists(_recordId) hasAccess(_recordId) {
        recordAccessCount[_recordId]++;
        emit RecordAccessed(
            _recordId,
            msg.sender,
            medicalRecords[_recordId].patient,
            block.timestamp
        );
    }

    function addEmergencyProvider(address _provider) external onlyOwner {
        require(_provider != address(0), "Invalid provider address");
        require(
            !emergencyProviders[_provider],
            "Provider already has emergency access"
        );
        emergencyProviders[_provider] = true;
        emit EmergencyProviderAdded(_provider, block.timestamp);
    }

    function removeEmergencyProvider(address _provider) external onlyOwner {
        require(
            emergencyProviders[_provider],
            "Provider does not have emergency access"
        );
        emergencyProviders[_provider] = false;
        emit EmergencyProviderRemoved(_provider, block.timestamp);
    }

    function getTotalRecords() external view returns (uint256) {
        return recordCounter;
    }

    function getRecordAccessCount(
        uint256 _recordId
    ) external view recordExists(_recordId) returns (uint256) {
        return recordAccessCount[_recordId];
    }

    function verifyRecordIntegrity(
        uint256 _recordId,
        bytes32 _providedHash
    )
        external
        view
        recordExists(_recordId)
        hasAccess(_recordId)
        returns (bool)
    {
        return medicalRecords[_recordId].recordHash == _providedHash;
    }

    function _removeFromProviderRecords(
        address _provider,
        uint256 _recordId
    ) internal {
        uint256[] storage records = providerAccessibleRecords[_provider];
        for (uint256 i = 0; i < records.length; i++) {
            if (records[i] == _recordId) {
                records[i] = records[records.length - 1];
                records.pop();
                break;
            }
        }
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid new owner address");
        owner = _newOwner;
    }

    function getVersion() external pure returns (string memory) {
        return "MedChainDb v1.0.0";
    }
}
