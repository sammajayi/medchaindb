"use client"

import { useState, useRef } from "react"
import { toast } from "sonner"
import { Upload, FileText, Image, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui"
import { ipfsService } from "@/lib/ipfs"
import { contractService } from "@/lib/contract"
import { useUser } from "@/contexts/UserContext"

export function FileUpload({ onFileSelect, onUpload, isUploading = false }) {
  const { address } = useUser()
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect?.(file)
      }
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        onFileSelect?.(file)
      }
    }
  }

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a PDF, JPG, or PNG file.')
      return false
    }

    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB.')
      return false
    }

    return true
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRealUpload = async (file) => {
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    try {
      setUploadProgress(10)
      
      // Step 1: Upload file to IPFS
      console.log('Uploading to IPFS...')
      const ipfsHash = await ipfsService.uploadFile(file)
      setUploadProgress(50)
      
      // Step 2: Store metadata on blockchain
      console.log('Storing metadata on blockchain...')
      const result = await contractService.uploadRecord(
        address,
        ipfsHash,
        file.name,
        file.type,
        file.size,
        `Health record uploaded on ${new Date().toLocaleDateString()}`
      )
      setUploadProgress(90)
      
      // Step 3: Complete
      setUploadProgress(100)
      console.log('Upload complete!')
      console.log('IPFS Hash:', ipfsHash)
      console.log('Transaction Hash:', result.txHash)
      console.log('Record ID:', result.recordId)
      
      // Call the parent component's upload handler
      onUpload?.(file, { ipfsHash, txHash: result.txHash, recordId: result.recordId })
      
      // Reset form
      setTimeout(() => {
        removeFile()
        setUploadProgress(0)
      }, 1000)
      
    } catch (error) {
      console.error('Upload failed:', error)
  toast.error(`Upload failed: ${error.message}`)
      setUploadProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />
    }
    return <Image className="w-8 h-8 text-blue-500" />
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-[#3DDAB4] bg-[#3DDAB4]/5' 
              : 'border-gray-300 hover:border-[#008C99]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-[#3DDAB4]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-[#008C99]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
            Upload Health Record
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Supports PDF, JPG, PNG files up to 10MB
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#008C99] hover:bg-[#007080] text-white"
          >
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getFileIcon(selectedFile.type)}
              <div>
                <p className="font-medium text-[#1E293B]">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={removeFile}
                variant="ghost"
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Uploading to IPFS...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#008C99] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                onClick={removeFile}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleRealUpload(selectedFile)}
                disabled={isUploading || !address}
                className="bg-[#008C99] hover:bg-[#007080] text-white"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : !address ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connect Wallet to Upload
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload to IPFS
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
