// Smart contract integration utilities
// This will be used to interact with the MedChainDb smart contract

import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig'
import { toast } from 'sonner'

export class ContractService {
  constructor() {
    this.contractAddress = CONTRACT_ADDRESS
    this.abi = CONTRACT_ABI
    this.walletClient = null
  }

  // Initialize contract with wallet client (call this when user connects wallet)
  initializeContract(walletClient) {
    // Store wallet client for contract interactions
    this.walletClient = walletClient
    console.log('Contract initialized with address:', this.contractAddress)
    console.log('Wallet client:', walletClient)
  }

  // Get all records for a patient
  async getPatientRecords(patientAddress) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }
      // Use wagmi's readContract to fetch records from the contract
      const { readContract } = await import('wagmi/actions')
      const records = await readContract({
        address: this.contractAddress,
        abi: this.abi,
        functionName: 'getPatientRecords',
        args: [patientAddress],
        account: patientAddress,
      })
      // Format records as needed for your UI
      return records
    } catch (error) {
  console.error('Error fetching patient records:', error)
  toast.error(`Error fetching patient records: ${error.message}`)
  throw error
    }
  }

  // Get records shared with a provider
  async getProviderRecords(providerAddress) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }
      // Use wagmi's readContract to fetch provider records from the contract
      const { readContract } = await import('wagmi/actions')
      const records = await readContract({
        address: this.contractAddress,
        abi: this.abi,
        functionName: 'getProviderRecords',
        args: [providerAddress],
        account: providerAddress,
      })
      // Format records as needed for your UI
      return records
    } catch (error) {
  console.error('Error fetching provider records:', error)
  toast.error(`Error fetching provider records: ${error.message}`)
  throw error
    }
  }

  // Upload a new record
  async uploadRecord(patientAddress, ipfsHash, fileName, fileType, fileSize, description = "") {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }
      // Use wagmi's writeContract to upload record to the contract
      const { writeContract } = await import('wagmi/actions')
      const tx = await writeContract({
        address: this.contractAddress,
        abi: this.abi,
        functionName: 'uploadRecord',
        args: [
          patientAddress,
          ipfsHash,
          fileName,
          fileType,
          fileSize,
          description
        ],
        account: patientAddress,
      })
      // You may need to parse tx for txHash and recordId
      return {
        txHash: tx.hash,
        recordId: tx.recordId || null
      }
    } catch (error) {
  console.error('Error uploading record:', error)
  toast.error(`Error uploading record: ${error.message}`)
  throw error
    }
  }

  // Grant access to a provider
  async grantAccess(providerAddress, recordId) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }

      // For now, return mock data until we implement the full contract integration
      console.log('Granting access:', { providerAddress, recordId })
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return mockTxHash
    } catch (error) {
  console.error('Error granting access:', error)
  toast.error(`Error granting access: ${error.message}`)
  throw error
    }
  }

  // Revoke access from a provider
  async revokeAccess(providerAddress, recordId) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }

      // For now, return mock data until we implement the full contract integration
      console.log('Revoking access:', { providerAddress, recordId })
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return mockTxHash
    } catch (error) {
  console.error('Error revoking access:', error)
  toast.error(`Error revoking access: ${error.message}`)
  throw error
    }
  }

  // Log record access (for providers)
  async logRecordAccess(recordId) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }

      // For now, return mock data until we implement the full contract integration
      console.log('Logging record access:', recordId)
      
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
      return mockTxHash
    } catch (error) {
  console.error('Error logging record access:', error)
  toast.error(`Error logging record access: ${error.message}`)
  throw error
    }
  }

  // Check if provider has access to a record
  async checkAccess(patientAddress, providerAddress, recordId) {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }

      // For now, return mock data until we implement the full contract integration
      console.log('Checking access:', { patientAddress, providerAddress, recordId })
      
      return true // Mock: always return true for demo
    } catch (error) {
  console.error('Error checking access:', error)
  toast.error(`Error checking access: ${error.message}`)
  throw error
    }
  }

  // Get contract version
  async getVersion() {
    try {
      if (!this.walletClient) {
        throw new Error('Wallet not connected. Please connect your wallet.')
      }

      // For now, return mock data until we implement the full contract integration
      console.log('Getting contract version')
      
      return "1.0.0" // Mock version
    } catch (error) {
  console.error('Error getting version:', error)
  toast.error(`Error getting contract version: ${error.message}`)
  throw error
    }
  }

  // Utility function to format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Generate a hash for the record (you might want to hash the actual file content)
  generateRecordHash(ipfsHash, fileName, fileType) {
    // This is a simple hash - you might want to use a more sophisticated method
    const data = `${ipfsHash}${fileName}${fileType}${Date.now()}`
    // In a real implementation, you'd use a proper hashing function
    return `0x${data.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0).toString(16).padStart(64, '0')}`
  }
}

// Create singleton instance
export const contractService = new ContractService()
