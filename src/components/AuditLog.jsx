"use client"

import { useState } from "react"
import { Activity, Upload, Share, UserMinus, Eye, Download, Filter, Calendar } from "lucide-react"
import { Button } from "@/components/ui"

// Dummy audit data for demonstration
const dummyAuditLog = [
  {
    id: "1",
    type: "upload",
    action: "Record Uploaded",
    description: "Blood Test Results - Jan 2024.pdf uploaded to IPFS",
    timestamp: "2024-01-15T10:30:00Z",
    txHash: "0x1234567890abcdef1234567890abcdef12345678",
    status: "success"
  },
  {
    id: "2",
    type: "access_granted",
    action: "Access Granted",
    description: "Granted access to Dr. Sarah Johnson (0x742d...8b6)",
    timestamp: "2024-01-15T11:15:00Z",
    txHash: "0x2345678901bcdef1234567890abcdef1234567890",
    status: "success"
  },
  {
    id: "3",
    type: "access_revoked",
    action: "Access Revoked",
    description: "Revoked access from City General Hospital (0x8ba1...d8e)",
    timestamp: "2024-01-18T09:30:00Z",
    txHash: "0x3456789012cdef1234567890abcdef12345678901",
    status: "success"
  },
  {
    id: "4",
    type: "view",
    action: "Record Viewed",
    description: "Dr. Sarah Johnson viewed Blood Test Results - Jan 2024.pdf",
    timestamp: "2024-01-20T14:22:00Z",
    txHash: null,
    status: "success"
  },
  {
    id: "5",
    type: "download",
    action: "Record Downloaded",
    description: "Dr. Sarah Johnson downloaded X-Ray Chest - Dec 2023.jpg",
    timestamp: "2024-01-20T14:25:00Z",
    txHash: null,
    status: "success"
  }
]

export function AuditLog({ auditData = dummyAuditLog }) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const getEventIcon = (type) => {
    switch (type) {
      case "upload":
        return <Upload className="w-4 h-4 text-blue-500" />
      case "access_granted":
        return <Share className="w-4 h-4 text-green-500" />
      case "access_revoked":
        return <UserMinus className="w-4 h-4 text-red-500" />
      case "view":
        return <Eye className="w-4 h-4 text-purple-500" />
      case "download":
        return <Download className="w-4 h-4 text-orange-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case "upload":
        return "bg-blue-100 text-blue-800"
      case "access_granted":
        return "bg-green-100 text-green-800"
      case "access_revoked":
        return "bg-red-100 text-red-800"
      case "view":
        return "bg-purple-100 text-purple-800"
      case "download":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const truncateHash = (hash) => {
    if (!hash) return "N/A"
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`
  }

  const filteredData = auditData.filter(item => {
    if (filter === "all") return true
    return item.type === filter
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.timestamp) - new Date(a.timestamp)
    } else {
      return new Date(a.timestamp) - new Date(b.timestamp)
    }
  })

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (auditData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No audit events yet</h3>
        <p className="text-gray-500">Activity will appear here as you use the platform</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#008C99] focus:border-transparent"
          >
            <option value="all">All Events</option>
            <option value="upload">Uploads</option>
            <option value="access_granted">Access Granted</option>
            <option value="access_revoked">Access Revoked</option>
            <option value="view">Views</option>
            <option value="download">Downloads</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#008C99] focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Audit Log List */}
      <div className="space-y-4">
        {sortedData.map((event) => (
          <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getEventIcon(event.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-medium text-[#1E293B]">{event.action}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventColor(event.type)}`}>
                    {event.type.replace('_', ' ')}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatTimestamp(event.timestamp)}</span>
                  {event.txHash && (
                    <button
                      onClick={() => copyToClipboard(event.txHash)}
                      className="flex items-center space-x-1 hover:text-[#008C99] transition-colors"
                      title="Copy transaction hash"
                    >
                      <span>TX: {truncateHash(event.txHash)}</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {auditData.filter(e => e.type === 'upload').length}
          </div>
          <div className="text-sm text-blue-800">Uploads</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {auditData.filter(e => e.type === 'access_granted').length}
          </div>
          <div className="text-sm text-green-800">Access Granted</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {auditData.filter(e => e.type === 'view').length}
          </div>
          <div className="text-sm text-purple-800">Views</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {auditData.filter(e => e.type === 'download').length}
          </div>
          <div className="text-sm text-orange-800">Downloads</div>
        </div>
      </div>
    </div>
  )
}
