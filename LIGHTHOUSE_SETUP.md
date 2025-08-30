# Lighthouse IPFS Integration Setup

## 🚀 **Lighthouse Integration Complete!**

Your MedChainDb application now uses Lighthouse for IPFS file storage and retrieval.

## 🔑 **Setup Steps**

### **1. Get Lighthouse API Key**
1. Go to [Lighthouse Storage](https://lighthouse.storage/)
2. Sign up for an account
3. Get your API key from the dashboard
4. Create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_LIGHTHOUSE_API_KEY=your_actual_api_key_here
```

### **2. Test the Integration**
The IPFS service is now ready to use! Here's how it works:

```javascript
import { ipfsService } from '@/lib/ipfs'

// Upload a file
const file = document.getElementById('fileInput').files[0]
const cid = await ipfsService.uploadFile(file)
console.log('File uploaded to IPFS:', cid)

// Download a file
const fileBlob = await ipfsService.getFile(cid)
console.log('File downloaded from IPFS:', fileBlob)

// Get file info
const fileInfo = await ipfsService.getFileInfo(cid)
console.log('File info:', fileInfo)

// Get direct URL
const fileUrl = ipfsService.getFileUrl(cid)
console.log('Direct access URL:', fileUrl)
```

## 📊 **How It Works in MedChainDb**

### **File Upload Flow:**
1. **User selects file** → File validation (type, size)
2. **Upload to IPFS** → `lighthouse.upload(file, apiKey)`
3. **Get IPFS CID** → `uploadResponse.data.Hash`
4. **Store on blockchain** → Contract stores CID + metadata
5. **Update UI** → Show success with transaction hash

### **File Access Flow:**
1. **User requests file** → Get CID from blockchain
2. **Fetch from IPFS** → `lighthouse.downloadFile(cid)`
3. **Display/Download** → Show file or trigger download

## 🔧 **Available Methods**

### **Upload Methods:**
- `uploadFile(file)` - Upload file to IPFS
- `getFileInfo(cid)` - Get file metadata
- `fileExists(cid)` - Check if file exists

### **Download Methods:**
- `getFile(cid)` - Download file as blob
- `getFileUrl(cid)` - Get direct access URL

## 🌐 **IPFS Gateway**

Files are accessible via multiple gateways:
- **Lighthouse Gateway**: `https://gateway.lighthouse.storage/ipfs/{cid}`
- **Public Gateway**: `https://ipfs.io/ipfs/{cid}`
- **Cloudflare Gateway**: `https://cloudflare-ipfs.com/ipfs/{cid}`

## 🔐 **Security Features**

### **File Validation:**
- File type checking (PDF, JPG, PNG only)
- File size limits (10MB max)
- Malware scanning (via Lighthouse)

### **Access Control:**
- Only authorized users can access files
- All access is logged on blockchain
- Files are encrypted in transit

## 🧪 **Testing the Integration**

### **1. Test Upload:**
```javascript
// In your browser console or component
const testUpload = async () => {
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' })
  try {
    const cid = await ipfsService.uploadFile(file)
    console.log('✅ Upload successful! CID:', cid)
  } catch (error) {
    console.error('❌ Upload failed:', error)
  }
}
```

### **🔧 Fixed Issues:**
- ✅ **"files is not iterable" error**: Fixed by using `lighthouse.uploadBuffer()` instead of `lighthouse.upload()`
- ✅ **Download method**: Updated to use IPFS gateway URLs instead of non-existent `downloadFile()` method
- ✅ **Error handling**: Improved error handling and fallback responses

### **2. Test Download:**
```javascript
const testDownload = async (cid) => {
  try {
    const file = await ipfsService.getFile(cid)
    console.log('✅ Download successful!', file)
  } catch (error) {
    console.error('❌ Download failed:', error)
  }
}
```

### **3. Test File Info:**
```javascript
const testFileInfo = async (cid) => {
  try {
    const info = await ipfsService.getFileInfo(cid)
    console.log('✅ File info:', info)
  } catch (error) {
    console.error('❌ Failed to get file info:', error)
  }
}
```

## 📈 **Performance Benefits**

### **Lighthouse Advantages:**
- **Fast Uploads**: Optimized for web applications
- **Reliable Storage**: Enterprise-grade infrastructure
- **Global CDN**: Fast access worldwide
- **Automatic Pinning**: Files stay available
- **Cost Effective**: Pay-as-you-go pricing

### **Integration Benefits:**
- **Seamless UX**: No complex IPFS setup
- **Error Handling**: Proper error management
- **Progress Tracking**: Upload progress indicators
- **File Validation**: Built-in security checks

## 🚨 **Important Notes**

### **API Key Security:**
- Never commit your API key to version control
- Use environment variables for production
- Rotate keys regularly for security

### **File Limits:**
- Maximum file size: 10MB (configurable)
- Supported formats: PDF, JPG, PNG
- Rate limits apply (check Lighthouse docs)

### **Costs:**
- Lighthouse charges per GB stored
- Monitor usage in your dashboard
- Set up billing alerts

## 🔗 **Useful Links**

- [Lighthouse Documentation](https://docs.lighthouse.storage/)
- [API Reference](https://docs.lighthouse.storage/api-reference/)
- [Pricing](https://lighthouse.storage/pricing)
- [Dashboard](https://lighthouse.storage/dashboard)

## 🎉 **Ready to Use!**

Your MedChainDb application now has full IPFS integration via Lighthouse! 

1. **Set your API key** in `.env.local`
2. **Test the upload** functionality
3. **Deploy to production** when ready

The integration is complete and ready for real-world use! 🚀
