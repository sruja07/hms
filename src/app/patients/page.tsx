"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Trash2,
  User,
  Phone,
  Droplets,
  MapPin,
  X,
  Loader2
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  contact: string;
  address: string;
  bloodGroup: string;
  createdAt: string;
}

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !contact || !address) return;
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          gender,
          contact,
          address,
          bloodGroup
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        // Reset form
        setName("");
        setAge("");
        setGender("Male");
        setContact("");
        setAddress("");
        setBloodGroup("A+");
        fetchPatients();
      }
    } catch (error) {
      console.error("Error creating patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return;
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchPatients();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500 mt-1">Manage and view all patient records.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-orange-600/20 w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patients by name or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Active Connection: Live DB
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white border border-slate-200 rounded-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
        </div>
      ) : (
        /* Table */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vitals</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Address Details</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{patient.name}</div>
                          <div className="text-xs text-slate-500">ID: PT-{patient.id.toString().padStart(4, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {patient.contact}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          {patient.age}y / {patient.gender.charAt(0)}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-100">
                          <Droplets className="w-3.5 h-3.5 text-red-500" />
                          {patient.bloodGroup}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {patient.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <User className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-lg font-medium text-slate-900">No patients found</p>
                        <p className="text-sm mt-1">We couldn't find any patients matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{filteredPatients.length}</span> patient profiles
            </p>
          </div>
        </div>
      )}

      {/* Add Patient Modal overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Register New Patient</h3>
                <p className="text-slate-300 text-xs mt-1">Add details to populate in billing/appointments.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddPatient} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alaka Goswami"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age</label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="120"
                    placeholder="e.g. 45"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                  >
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Home Address</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. 123 MG Road, Mumbai"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm resize-none"
                />
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
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
