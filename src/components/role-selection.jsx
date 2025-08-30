"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Button } from "@/components/ui"
import { useUser } from "@/contexts/UserContext"
import { User, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"

export function RoleSelection() {
  const { setRole, isConnected, address } = useUser()
  const router = useRouter()

  const handleRoleSelect = (role) => {
    setRole(role)
    if (role === "patient") {
      router.push("/patient")
    } else {
      router.push("/health-provider")
    }
  }

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-8">
            Please connect your wallet to continue and choose your role.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> You need to connect your wallet to access MedChainDb features.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#1E293B] mb-4">Choose Your Role</h2>
        <p className="text-gray-600 mb-4">
          Select how you want to use MedChainDb to get started with the appropriate dashboard.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <p className="text-green-800 text-sm">
            <strong>Connected:</strong> {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-gray-200 hover:border-[#008C99] transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#008C99] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-[#1E293B]">Patient</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Upload, manage, and share your health records securely with healthcare providers.
            </p>
            <Button
              onClick={() => handleRoleSelect("patient")}
              className="w-full bg-[#008C99] hover:bg-[#007080] text-white"
            >
              Continue as Patient
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200 hover:border-[#3DDAB4] transition-colors cursor-pointer">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-[#3DDAB4] rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-[#1E293B]">Healthcare Provider</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              Access patient records that have been shared with you securely and efficiently.
            </p>
            <Button
              onClick={() => handleRoleSelect("provider")}
              className="w-full bg-[#3DDAB4] hover:bg-[#2bc49a] text-white"
            >
              Continue as Provider
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
