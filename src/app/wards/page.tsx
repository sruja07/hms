"use client";

import { useState, useEffect } from "react";
import { 
  Building2,
  Bed as BedIcon,
  Users,
  Plus,
  Loader2,
  X
} from "lucide-react";

interface Bed {
  id: number;
  wardId: number;
  bedNumber: string;
  isOccupied: boolean;
}

interface Ward {
  id: number;
  name: string;
  type: string;
  beds: Bed[];
}

export default function WardsPage() {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [wardName, setWardName] = useState("");
  const [wardType, setWardType] = useState("General");

  const fetchWards = async () => {
    try {
      const res = await fetch("/api/wards");
      if (res.ok) {
        const data = await res.json();
        setWards(data);
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  const handleAddWard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardName) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/wards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wardName, type: wardType })
      });
      if (res.ok) {
        setIsModalOpen(false);
        setWardName("");
        setWardType("General");
        fetchWards();
      }
    } catch (error) {
      console.error("Error creating ward:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBed = async (bedId: number, currentOccupied: boolean) => {
    try {
      const res = await fetch(`/api/beds/${bedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOccupied: !currentOccupied })
      });
      if (res.ok) {
        fetchWards();
      }
    } catch (error) {
      console.error("Error toggling bed occupancy:", error);
    }
  };

  const handleAddBed = async (wardId: number, currentBedCount: number) => {
    try {
      const nextBedNumber = `B-${currentBedCount + 1}`;
      const res = await fetch("/api/beds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wardId,
          bedNumber: nextBedNumber,
          isOccupied: false
        })
      });
      if (res.ok) {
        fetchWards();
      }
    } catch (error) {
      console.error("Error adding bed:", error);
    }
  };

  // Calculations
  const totalWards = wards.length;
  const totalBeds = wards.reduce((sum, w) => sum + w.beds.length, 0);
  const occupiedBeds = wards.reduce((sum, w) => sum + w.beds.filter(b => b.isOccupied).length, 0);
  const availableBeds = totalBeds - occupiedBeds;

  return (
    <div className="space-y-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Wards & Beds</h1>
          <p className="text-slate-500 mt-1">Monitor bed availability and ward occupancy.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-orange-600/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Ward
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total active Wards</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{totalWards}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <BedIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Installed Beds</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{totalBeds}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Available Beds Left</p>
                <p className="text-3xl font-bold text-emerald-700 tracking-tight">{availableBeds}</p>
              </div>
            </div>
          </div>

          {/* Wards Grid */}
          <div className="flex justify-between items-center pt-4">
            <h2 className="text-xl font-bold text-slate-900">Ward Details & Live Interactive Bed Layout</h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              Interactive Mode: Click bed to toggle occupancy
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wards.map((ward) => {
              const wardTotalBeds = ward.beds.length;
              const wardOccupiedBeds = ward.beds.filter(b => b.isOccupied).length;
              const occupancyRate = wardTotalBeds > 0 ? (wardOccupiedBeds / wardTotalBeds) * 100 : 0;
              const wardAvailableBeds = wardTotalBeds - wardOccupiedBeds;

              return (
                <div key={ward.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between min-h-[340px]">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-slate-900">{ward.name}</h3>
                        <p className="text-slate-400 text-xs mt-0.5">Head Nurse: Sister in Charge</p>
                      </div>
                      <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold border border-orange-100 uppercase tracking-wider">
                        {ward.type}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm font-medium mb-2">
                        <span className="text-slate-600">Occupancy</span>
                        <span className={occupancyRate > 80 ? 'text-red-600' : 'text-emerald-600'}>
                          {Math.round(occupancyRate)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${occupancyRate > 80 ? 'bg-red-500' : occupancyRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${occupancyRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Interactive Bed Grid Layout */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Layout</span>
                        <button
                          onClick={() => handleAddBed(ward.id, wardTotalBeds)}
                          className="text-[10px] bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20 px-2 py-1 rounded-md font-extrabold flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Bed
                        </button>
                      </div>
                      
                      {wardTotalBeds === 0 ? (
                        <p className="text-xs text-slate-400 italic">No beds installed in this ward yet.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {ward.beds.map((bed) => (
                            <button
                              key={bed.id}
                              onClick={() => handleToggleBed(bed.id, bed.isOccupied)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-black transition-all ${
                                bed.isOccupied 
                                  ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" 
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              }`}
                              title={bed.isOccupied ? "Occupied - Click to Discharge" : "Available - Click to Admit"}
                            >
                              {bed.bedNumber}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-4">
                    <div className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Occupied</p>
                      <p className="text-xl font-bold text-slate-900">{wardOccupiedBeds}</p>
                    </div>
                    <div className="text-center p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                      <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-wider mb-0.5">Available</p>
                      <p className="text-xl font-bold text-emerald-700">{wardAvailableBeds}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add Ward Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Add Medical Ward</h3>
                <p className="text-slate-300 text-xs mt-1">Configure clinical wings and departments.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddWard} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ward Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. ICU, General Pediatric Ward"
                  value={wardName}
                  onChange={(e) => setWardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ward Type / Classification</label>
                <select
                  value={wardType}
                  onChange={(e) => setWardType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Cardiology">Cardiology</option>
                </select>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold text-center hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Ward"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
