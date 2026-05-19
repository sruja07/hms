"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Activity, 
  Stethoscope, 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck,
  X,
  Plus,
  Clock,
  User,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Printer,
  MapPin,
  CalendarDays
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  contact: string;
  availability: string;
}

interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  status: string;
  createdAt: string;
  patient: Patient;
  doctor: Doctor;
}

const packages = [
  {
    id: 1,
    title: "Youth Preventative Screen",
    category: "Teens & Youth",
    price: "8,200",
    description: "Essential metabolic and organ function screening designed specifically for growing teenagers and young adults.",
    tests: "Complete Blood Count, Vitamin D3, B12, Calcium Profile, Thyroid Panel, Basic Metabolic",
    target: "Ages 13-24",
    gender: "All Genders",
    duration: "4 Hours"
  },
  {
    id: 2,
    title: "Executive Core Wellness",
    category: "Adults",
    price: "15,500",
    description: "A comprehensive deep-dive into your physiological health, ideal for working professionals with high-stress lifestyles.",
    tests: "Full Lipid Panel, Liver Function, Kidney Panel, Advanced Cardiac Risk Markers, HbA1c",
    target: "Ages 25-50",
    gender: "All Genders",
    duration: "6 Hours"
  },
  {
    id: 3,
    title: "Cardiovascular Defense",
    category: "Heart Health",
    price: "12,000",
    description: "Targeted heart screening protocol evaluating arterial health, rhythm, and hidden cardiac risks.",
    tests: "Treadmill Test (TMT), Echocardiogram, High-Sensitivity CRP, Homocysteine",
    target: "Ages 35+",
    gender: "All Genders",
    duration: "3 Hours"
  },
  {
    id: 4,
    title: "Women's Comprehensive",
    category: "Women's Health",
    price: "14,500",
    description: "Holistic screening addressing specific female health metrics, hormonal balance, and preventative oncology.",
    tests: "Pap Smear, Ultrasound Pelvis, Mammogram, Complete Thyroid, Iron Profile",
    target: "Ages 25+",
    gender: "Female",
    duration: "5 Hours"
  }
];

const categoriesList = ["Teens & Youth", "Adults", "Heart Health", "Women's Health", "Senior Care", "Oncology Screen"];

export default function HealthChecksPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Booking Modal and Flow States
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSlip, setShowSlip] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  // New Patient Form State
  const [patientName, setPatientName] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientGender, setPatientGender] = useState("Male");
  const [patientBloodGroup, setPatientBloodGroup] = useState("O+");
  
  // Doctor & Schedule Select
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  // Fetch initial doctors & appointments data for schedule checks
  const fetchData = async () => {
    try {
      const [resAppts, resDocs] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/doctors")
      ]);
      const dataAppts = await resAppts.json();
      const dataDocs = await resDocs.json();
      setAppointments(Array.isArray(dataAppts) ? dataAppts : []);
      setDoctors(Array.isArray(dataDocs) ? dataDocs : []);
    } catch (err) {
      console.error("Error fetching database records inside HealthChecks:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenBooking = (pkg: any) => {
    // Determine target doctor specialization based on package category
    let targetSpecialty = "General Physician";
    if (pkg.category === "Heart Health") {
      targetSpecialty = "Cardiologist";
    } else if (pkg.category === "Women's Health") {
      targetSpecialty = "Gynecologist";
    }

    // Pre-select matching seeded doctor
    const matchingDoc = doctors.find(d => 
      d.specialization.toLowerCase().includes(targetSpecialty.toLowerCase())
    );
    if (matchingDoc) {
      setSelectedDoctorId(matchingDoc.id.toString());
    } else {
      setSelectedDoctorId("");
    }

    // Reset dates/times
    setAppointmentDate("");
    setAppointmentTime("");
    setIsModalOpen(true);
  };

  const isSlotBooked = (timeStr: string) => {
    if (!selectedDoctorId || !appointmentDate) return false;
    const targetDatePart = appointmentDate;
    return appointments.some(appt => {
      if (appt.doctorId !== parseInt(selectedDoctorId)) return false;
      if (appt.status.toLowerCase() === "cancelled") return false;
      try {
        const apptDatePart = appt.date.split('T')[0];
        return apptDatePart === targetDatePart && appt.time === timeStr;
      } catch {
        const apptDatePartObj = new Date(appt.date).toISOString().split('T')[0];
        return apptDatePartObj === targetDatePart && appt.time === timeStr;
      }
    });
  };

  // Form submission handler: 2-step DB entry
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientMobile || !patientAge || !selectedDoctorId || !appointmentDate || !appointmentTime) {
      alert("Please fill in all medical and contact details.");
      return;
    }

    try {
      setSubmitting(true);

      // STEP 1: Create Patient Profile in DB
      const patientResponse = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patientName,
          age: parseInt(patientAge),
          gender: patientGender,
          contact: patientMobile,
          address: "Registered via Online Screening Booking",
          bloodGroup: patientBloodGroup
        })
      });

      if (!patientResponse.ok) {
        throw new Error("Failed to register patient profile.");
      }

      const newPatient = await patientResponse.json();

      // STEP 2: Create Appointment linked to new Patient
      const appointmentResponse = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: newPatient.id,
          doctorId: parseInt(selectedDoctorId),
          date: appointmentDate,
          time: appointmentTime,
          status: "confirmed"
        })
      });

      if (!appointmentResponse.ok) {
        throw new Error("Failed to create appointment schedule.");
      }

      const newAppointment = await appointmentResponse.json();

      // Retrieve full joined details for the slip
      const selectedDoctorObj = doctors.find(d => d.id === parseInt(selectedDoctorId));

      const fullAppointmentObj: Appointment = {
        ...newAppointment,
        patient: newPatient,
        doctor: selectedDoctorObj || {
          id: parseInt(selectedDoctorId),
          name: "Consulting Specialist",
          specialization: "General Physician",
          contact: "",
          availability: ""
        }
      };

      setBookedAppointment(fullAppointmentObj);
      setShowSlip(true);
      
    } catch (err: any) {
      console.error("Booking workflow error:", err);
      alert(err.message || "Failed to process appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAndRefresh = () => {
    setIsModalOpen(false);
    setShowSlip(false);
    setBookedAppointment(null);
    // Reset Form fields
    setPatientName("");
    setPatientMobile("");
    setPatientAge("");
    setPatientGender("Male");
    setPatientBloodGroup("O+");
    setSelectedDoctorId("");
    setAppointmentDate("");
    setAppointmentTime("");
    fetchData();
  };

  const getDoctorRoom = (specialization: string) => {
    if (specialization.includes("Cardio")) return "Room 302 (Cardiology Wing, Floor 3)";
    if (specialization.includes("Neuro")) return "Room 408 (Neurology Wing, Floor 4)";
    if (specialization.includes("Orthoped")) return "Room 215 (Orthopedics Wing, Floor 2)";
    if (specialization.includes("Gyneco")) return "Room 105 (Maternity Block, Floor 1)";
    return "Room 112 (General Medicine, Floor 1)";
  };

  const getDoctorLocation = (specialization: string) => {
    if (specialization.includes("Cardio")) return "Tulsi Premier Hospital";
    if (specialization.includes("Neuro")) return "Tulsi Diagnostics Center";
    if (specialization.includes("Orthoped")) return "Tulsi Core Care";
    return "Tulsi Main Center";
  };

  const formatPrismaDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = activeCategory === "All" || pkg.category === activeCategory;
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.tests.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 relative">
      
      {/* Custom Stylesheet to handle pure Slip-only printing */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-area-wrapper, #print-area-wrapper * {
            visibility: visible !important;
          }
          #print-area-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Premium Hero Banner */}
      <div className="bg-[#0f172a] pt-20 pb-32 px-6 relative text-center">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#f97316]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-sm font-semibold mb-8 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-[#f97316]" />
            Preventative Care Programs
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f97316] to-amber-400">future health.</span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Tulsi Hospitals’ predictive diagnostic packages are engineered by leading specialists to catch risks before they become conditions.
          </p>
        </div>

        {/* Floating Search */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-20">
          <div className="bg-white rounded-2xl sm:rounded-full shadow-xl flex items-center p-2 border border-slate-100">
            <input 
              type="text" 
              placeholder="Search health conditions or specific tests..." 
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Modern Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <button 
            onClick={() => setActiveCategory("All")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
              activeCategory === "All" 
              ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/20' 
              : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All Programs
          </button>
          {categoriesList.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {filteredPackages.map(pkg => (
            <div key={pkg.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-1 relative flex flex-col">
              
              {/* Decorative Top Line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#f97316] to-[#0f172a] rounded-t-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                      {pkg.category}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-[#0f172a] transition-colors">{pkg.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-400 mb-1">Starting from</p>
                    <p className="text-3xl font-extrabold text-[#f97316]">₹{pkg.price}</p>
                  </div>
                </div>
                
                <p className="text-slate-600 text-base leading-relaxed mb-8 border-b border-slate-100 pb-8">
                  {pkg.description}
                </p>

                <div className="mb-8">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#f97316]" />
                    Included Diagnostics
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {pkg.tests}
                  </p>
                </div>

                {/* Attributes Row */}
                <div className="grid grid-cols-3 gap-4 mt-auto bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Demographic</p>
                    <p className="text-slate-800 text-sm font-bold">{pkg.target}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Gender</p>
                    <p className="text-slate-800 text-sm font-bold">{pkg.gender}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs font-semibold mb-1 uppercase tracking-wider">Duration</p>
                    <p className="text-slate-800 text-sm font-bold">{pkg.duration}</p>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="p-8 pt-0 mt-auto">
                <button 
                  onClick={() => handleOpenBooking(pkg)}
                  className="w-full py-4 rounded-xl font-bold text-base text-white bg-[#0f172a] hover:bg-slate-800 shadow-md transition-all flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  Schedule Screening <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[2rem] border border-slate-100 mt-8 max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No programs found</h3>
            <p className="text-slate-500 max-w-md mx-auto">We couldn't find any health packages matching your search criteria. Try a different term or view all programs.</p>
          </div>
        )}

      </div>

      {/* Booking Premium Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300 overflow-y-auto">
          
          {/* Slip Render Mode */}
          {showSlip && bookedAppointment ? (
            <div id="print-area-wrapper" className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg p-8 relative overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-300">
              
              {/* Slip Dotted Header Separator */}
              <div className="text-center pb-6 border-b-2 border-dashed border-slate-200">
                <div className="flex items-center justify-center gap-2 mb-2 text-[#f97316]">
                  <HeartPulse className="w-8 h-8" />
                  <span className="text-2xl font-black tracking-wider text-slate-950">TULSI HOSPITALS</span>
                </div>
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Diagnostic Screening Slip</p>
                <div className="mt-4 bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1 rounded-full border border-emerald-200 inline-block uppercase tracking-wider">
                  Confirmed Diagnostic Pass
                </div>
              </div>

              {/* Dotted Tear notches */}
              <div className="absolute top-[148px] -left-3 w-6 h-6 bg-slate-900/60 border border-slate-100 rounded-full no-print"></div>
              <div className="absolute top-[148px] -right-3 w-6 h-6 bg-slate-900/60 border border-slate-100 rounded-full no-print"></div>

              {/* Slip Body Details */}
              <div className="py-6 space-y-5 text-sm font-medium text-slate-700">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                  <span>Booking Reference</span>
                  <span className="text-slate-950 font-black">HS-TKT-00{bookedAppointment.id}</span>
                </div>

                {/* Patient section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#f97316]">Patient Details</span>
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs font-bold text-slate-800">
                    <div>Name: <span className="font-semibold text-slate-600">{bookedAppointment.patient?.name}</span></div>
                    <div>Contact: <span className="font-semibold text-slate-600">{bookedAppointment.patient?.contact}</span></div>
                    <div>Age/Gender: <span className="font-semibold text-slate-600">{bookedAppointment.patient?.age} Y / {bookedAppointment.patient?.gender}</span></div>
                    <div>Blood Group: <span className="font-semibold text-slate-600">{bookedAppointment.patient?.bloodGroup}</span></div>
                  </div>
                </div>

                {/* Doctor section */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Specialist</span>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900">{bookedAppointment.doctor?.name}</h4>
                      <p className="text-xs text-slate-500 font-semibold">{bookedAppointment.doctor?.specialization}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule section */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Date of Visit</span>
                    <p className="font-black text-slate-950">{formatPrismaDate(bookedAppointment.date)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Screening Time</span>
                    <p className="font-black text-slate-950">{bookedAppointment.time}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="pt-2 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostic Room</span>
                  <div className="flex items-center gap-1.5 text-slate-900 font-black">
                    <MapPin className="w-4 h-4 text-[#f97316]" />
                    {getDoctorRoom(bookedAppointment.doctor?.specialization || "")}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold pl-5">
                    {getDoctorLocation(bookedAppointment.doctor?.specialization || "")}
                  </p>
                </div>
              </div>

              {/* Decorative Medical Barcode */}
              <div className="pb-6 border-b-2 border-dashed border-slate-200 flex flex-col items-center gap-2">
                <div className="flex items-center gap-[2.5px] h-8">
                  {[1,3,1,2,4,1,3,2,1,4,2,3,1,2,1,4,1,2,3,1,4,1,2,1,3].map((w, idx) => (
                     <div key={idx} style={{ width: `${w}px` }} className="bg-slate-950 h-full"></div>
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  *HS-TKT-00{bookedAppointment.id}*
                </span>
              </div>

              {/* Print Slip Instructions */}
              <p className="text-[11px] text-slate-400 text-center font-bold mt-4 leading-normal">
                Please present this slip at the reception desk 15 minutes prior to your schedule.
              </p>

              {/* Actions Footer */}
              <div className="mt-8 flex gap-4 no-print">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-4 border border-slate-200 text-slate-700 rounded-2xl font-black text-center hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Printer className="w-5 h-5 text-[#f97316]" />
                  Print Pass
                </button>
                <button
                  onClick={handleCloseAndRefresh}
                  className="flex-1 py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black text-center transition-all shadow-lg"
                >
                  Done
                </button>
              </div>

            </div>
          ) : (
            
            /* Interactive Direct Booking Form */
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center relative">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">Schedule Diagnostic Screening</h3>
                  <p className="text-slate-300 text-sm mt-1">Direct patient screening registration. Complete all sections below.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleBookAppointment} className="p-8 space-y-6 overflow-y-auto flex-1">
                
                {/* Section A: Patient Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <User className="w-5 h-5 text-[#f97316]" />
                    <span className="text-sm font-black uppercase tracking-wider text-slate-800">1. Patient Information Details</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Patient Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Alaka Goswami"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Mobile Number</label>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={patientMobile}
                        onChange={(e) => setPatientMobile(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3 md:col-span-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Age</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 45"
                          min="1"
                          max="120"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm text-center"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center block">Gender</label>
                        <select
                          required
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide text-center block">Blood Group</label>
                        <select
                          required
                          value={patientBloodGroup}
                          onChange={(e) => setPatientBloodGroup(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                        >
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Section B: Doctor & Schedule */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <Stethoscope className="w-5 h-5 text-[#f97316]" />
                    <span className="text-sm font-black uppercase tracking-wider text-slate-800">2. Consultation & Specialist Slot</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Assigned Specialist</label>
                      <select
                        required
                        value={selectedDoctorId}
                        onChange={(e) => setSelectedDoctorId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                      >
                        <option value="">-- Choose Specialist --</option>
                        {doctors.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.specialization})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date of Visit</label>
                      <input
                        required
                        type="date"
                        value={appointmentDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#f97316]" />
                      <span className="text-sm font-black uppercase tracking-wider text-slate-800">3. Select Available Slot</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {!selectedDoctorId || !appointmentDate 
                        ? "Select date & doctor first" 
                        : "Live Availability Active"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {timeSlots.map(slot => {
                      const booked = isSlotBooked(slot);
                      const selected = appointmentTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          onClick={() => setAppointmentTime(slot)}
                          className={`py-2.5 rounded-xl border text-center font-extrabold text-xs transition-all duration-200 flex flex-col items-center justify-center min-h-[52px] ${
                            booked 
                              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60" 
                              : selected 
                                ? "bg-[#f97316] text-white border-transparent shadow-[0_0_10px_rgba(249,115,22,0.4)] scale-95" 
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <span>{slot}</span>
                          {booked && (
                            <span className="text-[8px] font-black uppercase text-red-500 mt-0.5 tracking-wider">
                              Booked
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 text-slate-600 rounded-2xl font-bold text-center hover:bg-slate-50 transition-all text-sm"
                  >
                    Discard Form
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-bold text-center transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Pass...
                      </>
                    ) : (
                      "Book Screening & Print Pass"
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
