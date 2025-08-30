export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#3DDAB4] rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-[#1E293B] mb-2">Loading Provider Dashboard</h2>
        <p className="text-gray-600">Please wait while we load your dashboard...</p>
      </div>
    </div>
  )
}
