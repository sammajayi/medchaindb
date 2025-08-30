"use client"

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield, Database, Users, Heart, Lock, Zap } from "lucide-react"
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function page() {
  const { isConnected, userRole, isConnecting } = useUser()
  const router = useRouter()

  // Redirect based on connection status and role
  useEffect(() => {
    if (!isConnecting && isConnected) {
      if (userRole === "patient") {
        router.push("/patient")
      } else if (userRole === "provider") {
        router.push("/health-provider")
      } else {
        router.push("/select-role")
      }
    }
  }, [isConnected, userRole, isConnecting, router])

  return (
    <>
      <Header />
      <div className="min-h-[60vh] bg-[#F9FAFB] flex flex-col items-center justify-center text-[#1E293B] px-4 sm:px-8">
        <div className="inline-flex items-center gap-2 bg-[#3DDAB4]/10 text-[#008C99] px-4 py-2 rounded-full text-sm font-medium border border-[#3DDAB4]/20 mt-8 mb-4">
          <Heart className="w-4 h-4" />
          Access your Health Records Anytime, Anywhere
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#008C99] text-center leading-tight max-w-2xl">
          Own and Share Your Health Records Securely
        </h1>
        <p className="text-lg mb-8 text-[#1E293B] text-center max-w-xl mx-auto">
          MedChainDb lets you control access to your health data with blockchain security.
        </p>
        <div className="w-full flex justify-center">
          <ConnectButton label="Get Started" />
        </div>
      </div>

      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#1E293B] mb-12">Why Choose MedChainDb?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="border-2 border-gray-100 hover:border-[#3DDAB4] transition-colors rounded-xl bg-white shadow-sm flex flex-col h-full">
              <div className="p-6 flex flex-col items-center justify-center flex-1">
                <div className="w-12 h-12 bg-[#3DDAB4] rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3 text-center">Secure & Private</h3>
                <p className="text-gray-600 text-center">
                  Your health records are encrypted and stored on IPFS with blockchain-based access control.
                </p>
              </div>
            </div>

            <div className="border-2 border-gray-100 hover:border-[#3DDAB4] transition-colors rounded-xl bg-white shadow-sm flex flex-col h-full">
              <div className="p-6 flex flex-col items-center justify-center flex-1">
                <div className="w-12 h-12 bg-[#3DDAB4] rounded-lg flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3 text-center">You Own Your Data</h3>
                <p className="text-gray-600 text-center">
                  Complete ownership and control over your medical records. No third-party can access without permission.
                </p>
              </div>
            </div>

            <div className="border-2 border-gray-100 hover:border-[#3DDAB4] transition-colors rounded-xl bg-white shadow-sm flex flex-col h-full">
              <div className="p-6 flex flex-col items-center justify-center flex-1">
                <div className="w-12 h-12 bg-[#3DDAB4] rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1E293B] mb-3 text-center">Easy Sharing</h3>
                <p className="text-gray-600 text-center">
                  Grant and revoke access to healthcare providers instantly with smart contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};