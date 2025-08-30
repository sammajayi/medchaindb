"use client"

import { useUser } from "@/contexts/UserContext"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { User, Stethoscope, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function AccountInfo() {
  const { address, isConnected, userRole, clearRole } = useUser()
  const router = useRouter()

  const handleLogout = () => {
    clearRole()
    router.push("/")
  }

  if (!isConnected) {
    return <ConnectButton label="Connect Wallet" />
  }

  return (
    <div className="flex items-center space-x-4">
      {/* Account Info */}
      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
        {userRole === "patient" ? (
          <User className="w-4 h-4 text-[#008C99]" />
        ) : userRole === "provider" ? (
          <Stethoscope className="w-4 h-4 text-[#3DDAB4]" />
        ) : (
          <User className="w-4 h-4 text-gray-500" />
        )}
        <div className="text-sm">
          <div className="font-medium text-[#1E293B]">
            {userRole === "patient" ? "Patient" : userRole === "provider" ? "Provider" : "User"}
          </div>
          <div className="text-gray-500 font-mono">
            {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        title="Logout"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Logout</span>
      </button>
    </div>
  )
}
