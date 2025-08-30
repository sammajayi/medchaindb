"use client"

import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/contractConfig'

export function useMedChainContract() {
  const { address, isConnected } = useAccount()
  const { writeContract } = useWriteContract()

  // Read contract functions
  const { data: patientRecords, refetch: refetchPatientRecords } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPatientRecords',
    args: [address],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { data: providerRecords, refetch: refetchProviderRecords } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAccessibleRecords',
    args: [address],
    query: {
      enabled: !!address && isConnected,
    },
  })

  const { data: contractVersion } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getVersion',
  })

  // Write contract functions
  const uploadRecord = async (ipfsCID, fileName, fileType, fileSize, recordHash, description) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'uploadRecord',
        args: [ipfsCID, fileName, fileType, fileSize, recordHash, description],
      })
      return hash
    } catch (error) {
      console.error('Error uploading record:', error)
      throw error
    }
  }

  const grantAccess = async (providerAddress, recordId) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'grantAccess',
        args: [providerAddress, recordId],
      })
      return hash
    } catch (error) {
      console.error('Error granting access:', error)
      throw error
    }
  }

  const revokeAccess = async (providerAddress, recordId) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'revokeAccess',
        args: [providerAddress, recordId],
      })
      return hash
    } catch (error) {
      console.error('Error revoking access:', error)
      throw error
    }
  }

  const logRecordAccess = async (recordId) => {
    try {
      const hash = await writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'logRecordAccess',
        args: [recordId],
      })
      return hash
    } catch (error) {
      console.error('Error logging record access:', error)
      throw error
    }
  }

  return {
    // Read functions
    patientRecords,
    providerRecords,
    contractVersion,
    refetchPatientRecords,
    refetchProviderRecords,
    
    // Write functions
    uploadRecord,
    grantAccess,
    revokeAccess,
    logRecordAccess,
    
    // State
    isConnected,
    address,
  }
}
