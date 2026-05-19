"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Star,
  Clock,
  MapPin,
  Calendar,
  Loader2
} from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  availability: string;
}

export default function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const response = await fetch("/api/doctors");
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Premium Header Section */}
      <div className="bg-[#0f172a] pt-12 pb-24 px-6 sm:px-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#f97316]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Our Specialists</h1>
            <p className="text-slate-300 text-lg max-w-xl">Find and book appointments with our world-class medical professionals.</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl sm:rounded-full p-2 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col sm:flex-row items-center gap-3 mb-12">
          <div className="relative w-full flex-1 flex items-center pl-4">
            <Search className="w-6 h-6 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by doctor name or medical specialty..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 px-4 py-3 text-lg"
            />
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-semibold hover:bg-slate-50 rounded-full transition-colors w-full sm:w-auto shrink-0">
            <Filter className="w-5 h-5" />
            All Specialties
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
          </div>
        ) : (
          <>
            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1.5 flex flex-col relative overflow-hidden">
                  
                  {/* Card Top Accent */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0f172a] to-[#0a2332] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f97316]/10 to-orange-50 text-[#f97316] flex items-center justify-center font-bold text-2xl border border-orange-100 shadow-sm group-hover:scale-110 group-hover:bg-[#f97316] group-hover:text-white transition-all duration-300">
                          {doctor.name.split(' ').length > 1 ? doctor.name.split(' ').slice(1).map(n => n[0]).join('') : doctor.name.substring(0, 2)}
                        </div>
                        {doctor.availability === 'Yes' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xl tracking-tight group-hover:text-[#0f172a] transition-colors">{doctor.name}</h3>
                        <p className="text-[#f97316] font-semibold text-sm mt-0.5">{doctor.specialization}</p>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-800 transition-colors p-2 hover:bg-slate-50 rounded-full">
                      <MoreHorizontal className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Status</span>
                      <span className="text-slate-800 font-bold">{doctor.availability === 'Yes' ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-100">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Rating</span>
                      <div className="flex items-center gap-1 font-bold text-slate-800">
                        4.8 <Star className="w-4 h-4 fill-amber-400 text-amber-400 -mt-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      {doctor.contact}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      contact@tulsihospitals.com
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8">
                    <Link 
                      href={`/appointments?action=book&doctorId=${doctor.id}`}
                      className="w-full py-3.5 rounded-xl border-2 border-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-all group/btn"
                    >
                      <Calendar className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      Book Appointment
                    </Link>
                  </div>

                </div>
              ))}
            </div>
            
            {/* Empty State */}
            {filteredDoctors.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No specialists found</h3>
                <p className="text-slate-500 max-w-md">We couldn't find any doctors matching "{searchTerm}". Try adjusting your filters or search terms.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
