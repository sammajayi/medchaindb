"use client"

import { useState } from "react"
import { Download, Eye, FileText, Image, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui"
import { ipfsService } from "@/lib/ipfs"

export function IPFSViewer({ record, onClose }) {
  const [isLoading, setIsLoading] = useState(false)
  const [fileBlob, setFileBlob] = useState(null)
  const [error, setError] = useState(null)

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />
    }
    return <Image className="w-8 h-8 text-blue-500" />
  }

  const handleViewFile = async () => {
    if (!record.ipfsHash) {
      setError('No IPFS hash available')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Fetching file from IPFS: ${record.ipfsHash}`)
      
      // Fetch file from IPFS
      const blob = await ipfsService.getFile(record.ipfsHash)
      setFileBlob(blob)
      
      // Create object URL for viewing
      const url = URL.createObjectURL(blob)
      
      // Open in new tab or download
      if (record.type === 'application/pdf') {
        window.open(url, '_blank')
      } else {
        // For images, show in modal or download
        const link = document.createElement('a')
        link.href = url
        link.download = record.name
        link.click()
      }
      
    } catch (error) {
      console.error('Error fetching file from IPFS:', error)
      setError(`Failed to fetch file: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadFile = async () => {
    if (!record.ipfsHash) {
      setError('No IPFS hash available')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log(`Downloading file from IPFS: ${record.ipfsHash}`)
      
      // Fetch file from IPFS
      const blob = await ipfsService.getFile(record.ipfsHash)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = record.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error downloading file from IPFS:', error)
      setError(`Failed to download file: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {getFileIcon(record.type)}
              <div>
                <h3 className="text-lg font-semibold text-[#1E293B]">{record.name}</h3>
                <p className="text-sm text-gray-500">IPFS Hash: {record.ipfsHash}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* File Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">File Type:</span>
                <p className="text-gray-600">{record.type}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">File Size:</span>
                <p className="text-gray-600">{record.size}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Upload Date:</span>
                <p className="text-gray-600">
                  {new Date(record.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">IPFS Status:</span>
                <p className="text-green-600">Available</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              onClick={handleViewFile}
              disabled={isLoading}
              className="bg-[#008C99] hover:bg-[#007080] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  View File
                </>
              )}
            </Button>
            
            <Button
              onClick={handleDownloadFile}
              disabled={isLoading}
              variant="outline"
              className="border-[#3DDAB4] text-[#3DDAB4] hover:bg-[#3DDAB4] hover:text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          </div>

          {/* IPFS Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">IPFS Information</h4>
            <p className="text-sm text-blue-700">
              This file is stored on IPFS (InterPlanetary File System) and can be accessed 
              using the hash above. The file is decentralized and available as long as 
              at least one node on the IPFS network has it pinned.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
