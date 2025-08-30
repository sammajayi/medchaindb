"use client"

import { useState } from "react"
import { Users, UserPlus, UserMinus, Copy, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui"
import { useUser } from "@/contexts/UserContext"

// Dummy data for demonstration
const dummyAccessList = [
  {
    id: "1",
    providerAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
    providerName: "Dr. Sarah Johnson",
    grantedDate: "2024-01-15T10:30:00Z",
    lastAccessed: "2024-01-20T14:22:00Z",
    recordsShared: 2,
    status: "active"
  },
  {
    id: "2",
    providerAddress: "0x8ba1f109551bD432803012645Hac136c4c8b8d8e",
    providerName: "City General Hospital",
    grantedDate: "2023-12-20T14:45:00Z",
    lastAccessed: "2024-01-18T09:15:00Z",
    recordsShared: 1,
    status: "active"
  }
]

export function AccessManagement({ accessList = dummyAccessList, onGrantAccess, onRevokeAccess }) {
  const { address } = useUser()
  const [providerAddress, setProviderAddress] = useState("")
  const [copiedAddress, setCopiedAddress] = useState("")
  const [showGrantForm, setShowGrantForm] = useState(false)

  // Use actual address if available, otherwise use dummy data
  const displayAccessList = address ? accessList : []

  const handleGrantAccess = () => {
    if (providerAddress.trim()) {
      onGrantAccess?.(providerAddress.trim())
      setProviderAddress("")
      setShowGrantForm(false)
    }
  }

  const handleRevokeAccess = (providerId) => {
    onRevokeAccess?.(providerId)
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedAddress(id)
    setTimeout(() => setCopiedAddress(""), 2000)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="space-y-6">
      {/* Grant Access Section */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1E293B] flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-[#008C99]" />
            Grant Access
          </h3>
          <Button
            onClick={() => setShowGrantForm(!showGrantForm)}
            className="bg-[#008C99] hover:bg-[#007080] text-white"
          >
            {showGrantForm ? "Cancel" : "Add Provider"}
          </Button>
        </div>

        {showGrantForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provider Wallet Address
              </label>
              <input
                type="text"
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#008C99] focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleGrantAccess}
                disabled={!providerAddress.trim()}
                className="bg-[#3DDAB4] hover:bg-[#2bc49a] text-white"
              >
                Grant Access
              </Button>
              <Button
                onClick={() => setShowGrantForm(false)}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Access List */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h3 className="text-lg font-semibold text-[#1E293B] mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-[#3DDAB4]" />
          Current Access Permissions
        </h3>

        {displayAccessList.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No access granted yet</h4>
            <p className="text-gray-500">Grant access to healthcare providers to share your records</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayAccessList.map((access) => (
              <div key={access.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-[#1E293B]">
                        {access.providerName || "Unknown Provider"}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        access.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {access.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <span className="font-mono">{truncateAddress(access.providerAddress)}</span>
                        <button
                          onClick={() => copyToClipboard(access.providerAddress, access.id)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                          {copiedAddress === access.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </span>
                      <span>Granted: {formatDate(access.grantedDate)}</span>
                      <span>Records: {access.recordsShared}</span>
                    </div>
                    {access.lastAccessed && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last accessed: {formatDate(access.lastAccessed)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleRevokeAccess(access.id)}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <UserMinus className="w-4 h-4 mr-1" />
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Access Control Information</p>
            <ul className="space-y-1 text-blue-700">
              <li>• Providers can only access records you explicitly share with them</li>
              <li>• You can revoke access at any time</li>
              <li>• All access events are logged on the blockchain</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
