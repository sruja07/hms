"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  MoreVertical,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Check,
  Printer,
  FileText,
  Activity,
  HeartPulse
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

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAppts, resDocs] = await Promise.all([
        fetch("/api/appointments"),
        fetch("/api/doctors")
      ]);

      const dataAppts = await resAppts.json();
      const dataDocs = await resDocs.json();

      setAppointments(Array.isArray(dataAppts) ? dataAppts : []);
      setDoctors(Array.isArray(dataDocs) ? dataDocs : []);
    } catch (err) {
      console.error("Error fetching database records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Listen to ?action=book
  useEffect(() => {
    if (searchParams.get("action") === "book") {
      setIsModalOpen(true);
      const docId = searchParams.get("doctorId");
      if (docId) {
        setSelectedDoctorId(docId);
      }
      // Remove query param from URL cleanly
      router.replace("/appointments");
    }
  }, [searchParams]);

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
          address: "Registered via Online Booking Slip",
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
          status: "confirmed" // Mark confirmed directly on booking
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
      setShowSlip(true); // Open Slip screen
      
    } catch (err: any) {
      console.error("Booking workflow error:", err);
      alert(err.message || "Failed to process appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Close and refresh
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
    fetchData(); // Sync DB records
  };

  // Helper to determine if a time slot is already booked for the chosen doctor & date
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

  // Auto-reset time slot if it gets booked or becomes invalid due to doctor/date changes
  useEffect(() => {
    if (appointmentTime && isSlotBooked(appointmentTime)) {
      setAppointmentTime("");
    }
  }, [selectedDoctorId, appointmentDate, appointmentTime]);

  // Helper formatting for room number & department wings
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

  const filteredAppointments = appointments.filter(a => {
    const docName = a.doctor?.name || "";
    const specialty = a.doctor?.specialization || "";
    const patName = a.patient?.name || "";
    const patMobile = a.patient?.contact || "";
    
    const matchesSearch = 
      docName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patMobile.includes(searchTerm);

    const isUpcoming = a.status.toLowerCase() === "upcoming" || a.status.toLowerCase() === "pending" || a.status.toLowerCase() === "confirmed";
    const isPast = a.status.toLowerCase() === "completed" || a.status.toLowerCase() === "cancelled";

    const matchesTab = 
      activeTab === "All" || 
      (activeTab === "Upcoming" && isUpcoming) || 
      (activeTab === "Past" && isPast);

    return matchesSearch && matchesTab;
  });

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-24 relative">
      
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

      {/* Page Header */}
      <div className="bg-[#0f172a] pt-16 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#f97316]/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">My Appointments</h1>
            <p className="text-slate-300 text-lg">Manage your upcoming visits and medical history.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Book New Appointment
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by doctor, patient, specialty, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] transition-all text-sm font-medium text-slate-700"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-slate-100 p-1.5 rounded-xl flex items-center w-full sm:w-auto">
              {["All", "Upcoming", "Past"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-bold flex-1 sm:flex-none transition-all ${
                    activeTab === tab 
                    ? 'bg-white text-[#0f172a] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-[#f97316] animate-spin" />
          </div>
        )}

        {/* Appointments Grid */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col">
                {/* Card Header */}
                <div className="p-6 border-b border-slate-50 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                      appointment.status === 'pending' || appointment.status === 'confirmed' || appointment.status === 'Upcoming' ? 'bg-blue-50 text-blue-600' :
                      appointment.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-slate-50 text-slate-500'
                    }`}>
                      {appointment.status === 'completed' ? <CheckCircle2 className="w-7 h-7" /> : <CalendarDays className="w-7 h-7" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#f97316] transition-colors">
                        {appointment.doctor?.name || "Unassigned Doctor"}
                      </h3>
                      <p className="text-sm font-semibold text-slate-500 flex items-center gap-1">
                        <Stethoscope className="w-4 h-4 text-slate-400" />
                        {appointment.doctor?.specialization || "General Physician"}
                      </p>
                      <p className="text-xs text-[#f97316] font-extrabold mt-1.5 uppercase tracking-wider">
                        Patient: {appointment.patient?.name || "Unknown"}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    appointment.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' :
                    appointment.status === 'confirmed' || appointment.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    appointment.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {appointment.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 bg-slate-50/50 flex-1">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Date</p>
                        <p className="text-sm font-bold text-slate-800">{formatPrismaDate(appointment.date)}</p>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase">Time</p>
                        <p className="text-sm font-bold text-slate-800">{appointment.time}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{getDoctorLocation(appointment.doctor?.specialization || "")}</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                  <div className="text-sm font-bold text-[#0f172a] bg-slate-100 px-4 py-1.5 rounded-lg">
                    Slip Reference: HS-APP-{appointment.id}
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors">
                      Reschedule
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredAppointments.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center max-w-2xl mx-auto mt-8 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No appointments found</h3>
            <p className="text-slate-500 mb-8">No records match your filters. Ready to schedule a medical visit?</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#0f172a] hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Book New Appointment
            </button>
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
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Appointment Booking Slip</p>
                <div className="mt-4 bg-emerald-50 text-emerald-700 font-black text-xs px-3 py-1 rounded-full border border-emerald-200 inline-block uppercase tracking-wider">
                  Confirmed Security Pass
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
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Consulting Specialist</span>
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
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Appointment Time</span>
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
                  Print Slip
                </button>
                <button
                  onClick={handleCloseAndRefresh}
                  className="flex-1 py-4 bg-[#0f172a] hover:bg-slate-800 text-white rounded-2xl font-black text-center transition-all shadow-lg"
                >
                  Dashboard Done
                </button>
              </div>

            </div>
          ) : (
            
            /* Interactive Direct Booking Form */
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center relative">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight">Book Appointment</h3>
                  <p className="text-slate-300 text-sm mt-1">Direct Patient details entry. Complete all sections below.</p>
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
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Choose Consulting Specialist</label>
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
                        Generating Slip...
                      </>
                    ) : (
                      "Book & Generate Slip"
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

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-[#f97316] animate-spin" />
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}
