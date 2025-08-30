"use client"

import { useState } from "react"
import { Search, User, FileText, Eye, Download, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui"

// Dummy patient data for demonstration
const dummyPatients = [
  {
    id: "1",
    walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
    name: "John Doe",
    recordsCount: 3,
    lastShared: "2024-01-20T14:22:00Z",
    sharedRecords: [
      {
        id: "1",
        name: "Blood Test Results - Jan 2024.pdf",
        type: "application/pdf",
        size: "2.3 MB",
        uploadDate: "2024-01-15T10:30:00Z",
        ipfsHash: "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx"
      },
      {
        id: "2",
        name: "X-Ray Chest - Dec 2023.jpg",
        type: "image/jpeg", 
        size: "4.1 MB",
        uploadDate: "2023-12-20T14:45:00Z",
        ipfsHash: "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy"
      }
    ]
  },
  {
    id: "2",
    walletAddress: "0x9876543210fedcba9876543210fedcba98765432",
    name: "Jane Smith",
    recordsCount: 2,
    lastShared: "2024-01-18T09:15:00Z",
    sharedRecords: [
      {
        id: "3",
        name: "MRI Scan - Jan 2024.pdf",
        type: "application/pdf",
        size: "8.7 MB",
        uploadDate: "2024-01-10T16:20:00Z",
        ipfsHash: "QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz"
      }
    ]
  }
]

export function PatientSearch({ patients = dummyPatients, onViewRecord, onDownloadRecord }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [copiedAddress, setCopiedAddress] = useState("")

  const filteredPatients = patients.filter(patient =>
    patient.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(id)
    setTimeout(() => setCopiedAddress(""), 2000)
  }

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="w-4 h-4 text-red-500" />
    }
    return <FileText className="w-4 h-4 text-blue-500" />
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
          <Search className="w-5 h-5 mr-2 text-[#3DDAB4]" />
          Search Patients
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Wallet Address or Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter wallet address or patient name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DDAB4] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h4 className="text-lg font-semibold text-[#1E293B] mb-4">Search Results</h4>
          
          {filteredPatients.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h5 className="text-lg font-medium text-gray-900 mb-2">No patients found</h5>
              <p className="text-gray-500">Try searching with a different wallet address or name</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <div key={patient.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#3DDAB4] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-[#1E293B]">
                          {patient.name || "Anonymous Patient"}
                        </h5>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <span className="font-mono">{truncateAddress(patient.walletAddress)}</span>
                          <button
                            onClick={() => copyToClipboard(patient.walletAddress, patient.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {copiedAddress === patient.id ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {patient.recordsCount} record{patient.recordsCount !== 1 ? 's' : ''} shared • 
                          Last shared: {formatDate(patient.lastShared)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedPatient(patient)}
                      className="bg-[#3DDAB4] hover:bg-[#2bc49a] text-white"
                    >
                      View Records
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Patient Records Modal */}
      {selectedPatient && (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-[#1E293B] flex items-center">
              <User className="w-5 h-5 mr-2 text-[#3DDAB4]" />
              {selectedPatient.name || "Anonymous Patient"} - Shared Records
            </h4>
            <Button
              onClick={() => setSelectedPatient(null)}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>

          {selectedPatient.sharedRecords.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h5 className="text-lg font-medium text-gray-900 mb-2">No records shared</h5>
              <p className="text-gray-500">This patient hasn't shared any records with you yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPatient.sharedRecords.map((record) => (
                <div key={record.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getFileIcon(record.type)}
                      <div>
                        <h6 className="font-medium text-[#1E293B]">{record.name}</h6>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{record.size}</span>
                          <span>Uploaded: {formatDate(record.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onViewRecord?.(record)}
                        variant="ghost"
                        className="text-gray-600 hover:text-[#3DDAB4]"
                        title="View Record"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDownloadRecord?.(record)}
                        variant="ghost"
                        className="text-gray-600 hover:text-[#3DDAB4]"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Patient Search Information</p>
            <ul className="space-y-1 text-blue-700">
              <li>• You can only view records that patients have explicitly shared with your wallet address</li>
              <li>• All access to patient records is logged and auditable</li>
              <li>• Patients can revoke access at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
