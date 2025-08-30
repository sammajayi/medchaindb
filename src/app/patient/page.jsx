"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui"
import { Shield, Upload, FileText, Users, Activity } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FileUpload } from "@/components/FileUpload"
import { RecordsList } from "@/components/RecordsList"
import { AccessManagement } from "@/components/AccessManagement"
import { AuditLog } from "@/components/AuditLog"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AccountInfo } from "@/components/AccountInfo"
import { useMedChainContract } from "@/hooks/useMedChainContract"

export default function PatientDashboard() {
  const { isConnected, address, userRole, isConnecting } = useUser()
  const { 
    patientRecords, 
    uploadRecord, 
    grantAccess, 
    revokeAccess, 
    refetchPatientRecords,
    contractVersion 
  } = useMedChainContract()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("records")
  const [isUploading, setIsUploading] = useState(false)

  // Redirect if not connected or not a patient
  useEffect(() => {
    if (!isConnecting) {
      if (!isConnected) {
        router.push("/")
        return
      }
      if (userRole && userRole !== "patient") {
        router.push("/select-role")
        return
      }
    }
  }, [isConnected, userRole, isConnecting, router])

  // Show loading while checking connection
  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#008C99] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Connecting...</h2>
          <p className="text-gray-600">Please wait while we connect to your wallet</p>
        </div>
      </div>
    )
  }


  if (!isConnected || (userRole && userRole !== "patient")) {
    return null 
  }

  // UI only, no logic yet
  const handleFileSelect = (file) => {
    console.log("File selected:", file.name)
  }

  const handleUpload = async (file, uploadData) => {
    setIsUploading(true)
    try {
      // Generate a hash for the record
      const recordHash = `0x${Math.random().toString(16).substr(2, 64)}`
      
      // Upload to contract
      const txHash = await uploadRecord(
        uploadData.ipfsHash,
        file.name,
        file.type,
        file.size,
        recordHash,
        `Health record uploaded on ${new Date().toLocaleDateString()}`
      )
      
      console.log('Upload successful!', { txHash, recordId: uploadData.recordId })
      toast.success(`File "${file.name}" uploaded successfully!`, {
        description: `Transaction: ${txHash}`
      })
      
      // Refresh records list
      refetchPatientRecords()
    } catch (error) {
      console.error('Upload failed:', error)
  toast.error(`Upload failed: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleShareRecord = (record) => {
    toast.info(`Share access for "${record.name}"`, {
      description: "Use the Access Management tab to grant access to providers"
    })
  }

  const handleViewRecord = (record) => {
    toast.info(`View "${record.name}"`, {
      description: "This will open the IPFS viewer"
    })
  }

  const handleDownloadRecord = (record) => {
    toast.info(`Download "${record.name}"`, {
      description: "This will download from IPFS"
    })
  }

  const handleGrantAccess = async (providerAddress) => {
    try {
     
      const recordId = 1
      const txHash = await grantAccess(providerAddress, recordId)
      toast.success(`Access granted to ${providerAddress}!`, {
        description: `Transaction: ${txHash}`
      })
      refetchPatientRecords()
    } catch (error) {
      console.error('Grant access failed:', error)
  toast.error(`Failed to grant access: ${error.message}`)
    }
  }

  const handleRevokeAccess = async (providerId) => {
    try {
     
      const recordId = 1
      const txHash = await revokeAccess(providerId, recordId)
      toast.success(`Access revoked for provider ${providerId}!`, {
        description: `Transaction: ${txHash}`
      })
      refetchPatientRecords()
    } catch (error) {
      console.error('Revoke access failed:', error)
  toast.error(`Failed to revoke access: ${error.message}`)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#008C99] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#1E293B]">MedChainDb</span>
              <span className="text-sm text-gray-500 ml-4">Patient Dashboard</span>
            </div>
            <AccountInfo />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Welcome to Your Health Records</h1>
          <p className="text-gray-600 mb-4">
            Manage your medical records securely and share them with healthcare providers on your terms.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 inline-block">
            <p className="text-blue-800 text-sm">
              <strong>Account:</strong> {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === "records" ? "default" : "ghost"}
            onClick={() => setActiveTab("records")}
            className={`${
              activeTab === "records"
                ? "bg-[#008C99] text-white hover:bg-[#007080]"
                : "text-gray-600 hover:text-[#008C99]"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">My Records</span>
            <span className="sm:hidden">Records</span>
          </Button>
          <Button
            variant={activeTab === "upload" ? "default" : "ghost"}
            onClick={() => setActiveTab("upload")}
            className={`${
              activeTab === "upload"
                ? "bg-[#008C99] text-white hover:bg-[#007080]"
                : "text-gray-600 hover:text-[#008C99]"
            }`}
          >
            <Upload className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Upload Record</span>
            <span className="sm:hidden">Upload</span>
          </Button>
          <Button
            variant={activeTab === "access" ? "default" : "ghost"}
            onClick={() => setActiveTab("access")}
            className={`${
              activeTab === "access"
                ? "bg-[#008C99] text-white hover:bg-[#007080]"
                : "text-gray-600 hover:text-[#008C99]"
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Access Management</span>
            <span className="sm:hidden">Access</span>
          </Button>
          <Button
            variant={activeTab === "audit" ? "default" : "ghost"}
            onClick={() => setActiveTab("audit")}
            className={`${
              activeTab === "audit"
                ? "bg-[#008C99] text-white hover:bg-[#007080]"
                : "text-gray-600 hover:text-[#008C99]"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Audit Log</span>
            <span className="sm:hidden">Audit</span>
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "records" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">My Records</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordsList 
                  records={patientRecords || []}
                  onShare={handleShareRecord}
                  onView={handleViewRecord}
                  onDownload={handleDownloadRecord}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === "upload" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Upload Health Record</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload 
                  onFileSelect={handleFileSelect}
                  onUpload={handleUpload}
                  isUploading={isUploading}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === "access" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Access Management</CardTitle>
              </CardHeader>
              <CardContent>
                <AccessManagement 
                  onGrantAccess={handleGrantAccess}
                  onRevokeAccess={handleRevokeAccess}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === "audit" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditLog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}