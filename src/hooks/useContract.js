"use client"

import { useEffect } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { contractService } from '@/lib/contract'

export function useContract() {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (isConnected && walletClient && address) {
      // Initialize contract with wallet client when wallet is connected
      contractService.initializeContract(walletClient)
      console.log('Contract initialized for address:', address)
    }
  }, [isConnected, walletClient, address])

  return {
    contractService,
    isContractReady: isConnected && walletClient && address
  }
}
