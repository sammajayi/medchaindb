"use client";

export default function Footer() {
	return (
		<footer className="w-full bg-[#F9FAFB] border-t border-gray-100 mt-16">
			<div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
				<span>© {new Date().getFullYear()} MedChainDb. All rights reserved.</span>
				<div className="flex gap-4 mt-2 md:mt-0">
					<a href="#" className="hover:text-[#008C99] transition-colors">Privacy</a>
					<a href="#" className="hover:text-[#008C99] transition-colors">Terms</a>
				</div>
			</div>
		</footer>
	);
}
