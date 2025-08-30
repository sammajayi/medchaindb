"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";
import { Shield, FileText, Search, Activity } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RecordsList } from "@/components/RecordsList";
import { PatientSearch } from "@/components/PatientSearch";
import { AuditLog } from "@/components/AuditLog";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AccountInfo } from "@/components/AccountInfo";

export default function ProviderDashboard() {
  const { isConnected, address, userRole, isConnecting } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("records");

  // Redirect if not connected or not a provider
  useEffect(() => {
    if (!isConnecting) {
      if (!isConnected) {
        router.push("/")
        return
      }
      if (userRole && userRole !== "provider") {
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
          <div className="w-16 h-16 bg-[#3DDAB4] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Connecting...</h2>
          <p className="text-gray-600">Please wait while we connect to your wallet</p>
        </div>
      </div>
    )
  }

  // Show access denied if not connected or wrong role
  if (!isConnected || (userRole && userRole !== "provider")) {
    return null // Will redirect via useEffect
  }

  // UI only, no logic yet
  const handleViewRecord = (record) => {
    alert(`View "${record.name}" (This is a demo)`)
  }

  const handleDownloadRecord = (record) => {
    alert(`Download "${record.name}" (This is a demo)`)
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
              <span className="text-sm text-gray-500 ml-4">Provider Dashboard</span>
            </div>
            <AccountInfo />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Healthcare Provider Dashboard</h1>
          <p className="text-gray-600 mb-4">
            Access patient health records that have been securely shared with your wallet address.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 inline-block">
            <p className="text-green-800 text-sm">
              <strong>Provider Account:</strong> {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
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
                ? "bg-[#3DDAB4] text-white hover:bg-[#2bc49a]"
                : "text-gray-600 hover:text-[#3DDAB4]"
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Shared Records</span>
            <span className="sm:hidden">Records</span>
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            onClick={() => setActiveTab("search")}
            className={`${
              activeTab === "search"
                ? "bg-[#3DDAB4] text-white hover:bg-[#2bc49a]"
                : "text-gray-600 hover:text-[#3DDAB4]"
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Patient Search</span>
            <span className="sm:hidden">Search</span>
          </Button>
          <Button
            variant={activeTab === "audit" ? "default" : "ghost"}
            onClick={() => setActiveTab("audit")}
            className={`${
              activeTab === "audit"
                ? "bg-[#3DDAB4] text-white hover:bg-[#2bc49a]"
                : "text-gray-600 hover:text-[#3DDAB4]"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Access Log</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === "records" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Shared Records</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordsList 
                  onView={handleViewRecord}
                  onDownload={handleDownloadRecord}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === "search" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Patient Search</CardTitle>
              </CardHeader>
              <CardContent>
                <PatientSearch 
                  onViewRecord={handleViewRecord}
                  onDownloadRecord={handleDownloadRecord}
                />
              </CardContent>
            </Card>
          )}
          {activeTab === "audit" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#1E293B]">Access Log</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditLog />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
