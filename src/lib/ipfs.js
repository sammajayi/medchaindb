// IPFS integration utilities using Lighthouse
import lighthouse from '@lighthouse-web3/sdk'

export class IPFSService {
  constructor() {
   
    this.apiKey = process.env.NEXT_PUBLIC_LIGHT_HOUSE_APIKEY
  }

  // Upload file to IPFS using Lighthouse
  async uploadFile(file) {
    try {
      console.log('Uploading file to IPFS via Lighthouse:', file.name)
      
      // Convert file to buffer
      // const buffer = await file.arrayBuffer()
      
      // Upload to IPFS using Lighthouse uploadBuffer method
      // const uploadResponse = await lighthouse.uploadBuffer(
      //   // Buffer.from(buffer), 
      //   this.apiKey,
      //   file.name
      // )
      console.log('API Key:', this.apiKey);
console.log('File:', file);
      const uploadResponse = await lighthouse.upload(
        [file],
        this.apiKey
      )
      


      console.log('Lighthouse upload response:', uploadResponse)
      
      // Return the IPFS hash (CID)
      return uploadResponse.data.Hash
    } catch (error) {
      
      console.error('Error uploading to IPFS via Lighthouse:', error)
      throw error
    }
  }

  // Retrieve file from IPFS
  async getFile(cid) {
    try {
      console.log('Fetching file from IPFS:', cid)
      
      // Fetch file from IPFS gateway
      const response = await fetch(this.getFileUrl(cid))
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`)
      }
      
      // Convert response to blob
      const blob = await response.blob()
      
      return blob
    } catch (error) {
      console.error('Error retrieving from IPFS:', error)
       if (error.response) {
    console.error('Response data:', await error.response.text());
  }
  throw error;
      
    }
  }

  // Get file info from IPFS
  async getFileInfo(cid) {
    try {
      console.log('Getting file info from IPFS:', cid)
      
      // Get file info from IPFS using Lighthouse
      const fileInfo = await lighthouse.getFileInfo(cid)
      
      return {
        size: fileInfo.data?.size || 0,
        type: fileInfo.data?.type || 'file',
        name: fileInfo.data?.name || 'Unknown',
        cid: cid
      }
    } catch (error) {
      console.error('Error getting file info:', error)
      // Return basic info if API call fails
      return {
        size: 0,
        type: 'file',
        name: 'Unknown',
        cid: cid
      }
    }
  }

  // Get file access URL
  getFileUrl(cid) {
    return `https://gateway.lighthouse.storage/ipfs/${cid}`
  }

  // Check if file exists on IPFS
  async fileExists(cid) {
    try {
      const response = await fetch(this.getFileUrl(cid), { method: 'HEAD' })
      return response.ok
    } catch (error) {
      return false
    }
  }
}

// Create singleton instance
export const ipfsService = new IPFSService()
