"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import CentresOfExcellence from "@/components/CentresOfExcellence";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/doctors?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickLinks = [
    { name: "Book Appointment", href: "/appointments?action=book" },
    { name: "Find Hospital", href: "/hospitals" },
    { name: "Book Health Check", href: "/health-checks" },
    { name: "Get Expert Opinion", href: "/second-opinion" },
  ];

  return (
    <main className="w-full flex flex-col">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] lg:min-h-screen w-full flex flex-col justify-end items-center pb-24 animate-in fade-in duration-1000 overflow-hidden bg-[#0b1329]">
        {/* Background Video (Scaled to hide watermark) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 scale-[1.15] bg-[#0b1329]"
        >
          {/* The user can drop their custom hospital video into public/hospital-bg.mp4 */}
          <source src="/hospital-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/40 to-transparent z-0"></div>

        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center space-y-8">
          {/* Search Bar */}
          <div className="w-full relative">
            <form
              onSubmit={handleSearch}
              className="w-full bg-[#0a2332]/80 backdrop-blur-md rounded-full border border-white/20 p-2 flex items-center shadow-2xl"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search For Doctors, Specialities And Health Check Packages..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/70 px-6 py-2 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#f97316] flex items-center justify-center text-white hover:bg-[#ea580c] transition-colors flex-shrink-0 shadow-lg"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Quick Actions Bar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-0">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`
                group flex items-center justify-between bg-white text-[#0f172a] px-6 py-4 w-full sm:w-auto flex-1 hover:bg-slate-50 transition-colors
                ${index === 0 ? "sm:rounded-l-full rounded-t-2xl sm:rounded-tr-none" : ""}
                ${index === quickLinks.length - 1 ? "sm:rounded-r-full rounded-b-2xl sm:rounded-bl-none" : ""}
                ${index !== quickLinks.length - 1 ? "sm:border-r border-slate-200" : ""}
                border-b sm:border-b-0 border-slate-200
              `}
              >
                <span className="font-bold text-sm tracking-wide">
                  {link.name}
                </span>
                <div className="w-6 h-6 rounded-full border border-[#0f172a] flex items-center justify-center group-hover:bg-[#0f172a] group-hover:text-white transition-all ml-4">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Centres of Excellence Section */}
      <CentresOfExcellence />
    </main>
  );
}
