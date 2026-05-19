"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Share2 } from "lucide-react";

const cities = [
  "All",
  "Ahmedabad",
  "Bangalore",
  "Bhopal",
  "Bhubaneswar",
  "Chennai",
  "Delhi",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Kolkata",
  "Mumbai",
  "Pune",
];

interface Hospital {
  id: number;
  name: string;
  address: string;
  contact: string;
  city: string;
  image?: string;
}

export default function HospitalsPage() {
  const [activeCity, setActiveCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cityParam = params.get("city");
      if (cityParam && cities.includes(cityParam)) {
        setActiveCity(cityParam);
      }
    }
  }, [typeof window !== "undefined" ? window.location.search : ""]);

  useEffect(() => {
    fetchHospitals();
  }, [activeCity]);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const query = activeCity === "All" ? "" : `?city=${activeCity}`;
      const res = await fetch(`/api/hospitals${query}`);
      const data = await res.json();
      if (!res.ok) {
        console.error("API error:", data);
        setHospitals([]);
      } else {
        setHospitals(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHospitals = Array.isArray(hospitals) ? hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  }) : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
      {/* Premium Header Section */}
      <div className="bg-[#0f172a] pt-16 pb-28 px-4 text-center relative">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#f97316]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Tulsi Hospitals Network
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover world-class healthcare facilities, advanced diagnostics,
            and unparalleled medical expertise near you.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
          <div className="bg-white rounded-2xl sm:rounded-full shadow-xl flex items-center p-2 border border-slate-100">
            <input
              type="text"
              placeholder="Search by facility name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-slate-700 text-lg placeholder:text-slate-400"
            />
            <button className="bg-[#f97316] hover:bg-[#ea580c] text-white p-4 rounded-full transition-colors shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
        {/* Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-[#f97316] rounded-full"></div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Available Facilities{" "}
            <span className="text-slate-400 font-medium">
              ({filteredHospitals.length})
            </span>
          </h2>
        </div>

        {/* City Filter Tabs */}
        <div className="flex flex-wrap gap-x-4 gap-y-3 mb-10 text-sm font-semibold">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 ${
                activeCity === city
                  ? "bg-[#0f172a] text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#0f172a] hover:text-[#0f172a]"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row group transition-all hover:-translate-y-1"
            >
              {/* Image Section */}
              <div className="w-full md:w-2/5 h-56 md:h-auto relative overflow-hidden">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden"></div>
              </div>

              {/* Details Section */}
              <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-[#f97316] transition-colors">
                      {hospital.name}
                    </h3>
                    <button className="text-slate-400 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-slate-600 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="leading-relaxed mt-1.5">
                        {hospital.address}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-400" />
                      </div>
                      {hospital.contact}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No facilities found
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find any locations matching your criteria. Try
              selecting a different city or adjusting your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
