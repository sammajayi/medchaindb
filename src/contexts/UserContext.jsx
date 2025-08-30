"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

const UserContext = createContext()

export function UserProvider({ children }) {
  const { address, isConnected, isConnecting } = useAccount()
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user role from localStorage when address changes
  useEffect(() => {
    if (address) {
      const savedRole = localStorage.getItem(`userRole_${address}`)
      if (savedRole) {
        setUserRole(savedRole)
      }
    } else {
      setUserRole(null)
    }
  }, [address])

  const setRole = (role) => {
    if (address) {
      setUserRole(role)
      localStorage.setItem(`userRole_${address}`, role)
    }
  }

  const clearRole = () => {
    if (address) {
      localStorage.removeItem(`userRole_${address}`)
    }
    setUserRole(null)
  }

  const value = {
    // Account state
    address,
    isConnected,
    isConnecting,
    
    // Role management
    userRole,
    setRole,
    clearRole,
    
    // Loading state
    isLoading,
    setIsLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
