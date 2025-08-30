"use client"

import { useState } from "react"
import { FileText, Image, Download, Share, Eye, MoreVertical, Calendar, Hash } from "lucide-react"
import { Button } from "@/components/ui"
import { useUser } from "@/contexts/UserContext"

// Dummy data for demonstration
const dummyRecords = [
  {
    id: "1",
    name: "Blood Test Results - Jan 2024.pdf",
    type: "application/pdf",
    size: "2.3 MB",
    uploadDate: "2024-01-15T10:30:00Z",
    ipfsHash: "QmXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
    sharedWith: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "0x8ba1f109551bD432803012645Hac136c4c8b8d8e"]
  },
  {
    id: "2", 
    name: "X-Ray Chest - Dec 2023.jpg",
    type: "image/jpeg",
    size: "4.1 MB",
    uploadDate: "2023-12-20T14:45:00Z",
    ipfsHash: "QmYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYyYy",
    sharedWith: ["0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"]
  },
  {
    id: "3",
    name: "Prescription - Nov 2023.pdf", 
    type: "application/pdf",
    size: "1.8 MB",
    uploadDate: "2023-11-10T09:15:00Z",
    ipfsHash: "QmZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZzZz",
    sharedWith: []
  }
]

export function RecordsList({ records = dummyRecords, onShare, onView, onDownload }) {
  const { address } = useUser()
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Use actual address if available, otherwise use dummy data
  const displayRecords = address ? records : []

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />
    }
    return <Image className="w-6 h-6 text-blue-500" />
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

  const truncateHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`
  }

  if (displayRecords.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No records uploaded yet</h3>
        <p className="text-gray-500">Upload your first health record to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayRecords.map((record) => (
        <div key={record.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {getFileIcon(record.type)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#1E293B] truncate">{record.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(record.uploadDate)}
                  </span>
                  <span>{record.size}</span>
                  <span className="flex items-center">
                    <Hash className="w-3 h-3 mr-1" />
                    {truncateHash(record.ipfsHash)}
                  </span>
                </div>
                {record.sharedWith.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-[#008C99] bg-[#008C99]/10 px-2 py-1 rounded-full">
                      Shared with {record.sharedWith.length} provider{record.sharedWith.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onView?.(record)}
                variant="ghost"
                className="text-gray-600 hover:text-[#008C99]"
                title="View Record"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDownload?.(record)}
                variant="ghost"
                className="text-gray-600 hover:text-[#3DDAB4]"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onShare?.(record)}
                variant="ghost"
                className="text-gray-600 hover:text-[#008C99]"
                title="Share Access"
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
