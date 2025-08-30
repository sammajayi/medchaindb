"use client";

import { Shield } from "lucide-react";

export default function Header() {
	return (
		<header className="w-full bg-white border-b border-gray-100 shadow-sm">
			<div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-2">
					<Shield className="w-6 h-6 text-[#008C99]" />
					<span className="font-bold text-xl text-[#008C99] tracking-tight">MedChainDb</span>
				</div>
				<nav className="hidden md:flex gap-6">
					<a href="#features" className="text-[#1E293B] hover:text-[#008C99] font-medium transition-colors">Features</a>
					<a href="#" className="text-[#1E293B] hover:text-[#008C99] font-medium transition-colors">Docs</a>
				</nav>
			</div>
		</header>
	);
}
