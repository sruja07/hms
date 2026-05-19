"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Stethoscope, 
  CalendarDays, 
  Bed, 
  Loader2,
  Clock,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  availableBeds: number;
}

interface Appointment {
  id: number;
  time: string;
  status: string;
  patient: { name: string; contact: string };
  doctor: { name: string; specialization: string };
}

export default function ClinicalDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, appointmentsRes] = await Promise.all([
          fetch("/api/dashboard"),
          fetch("/api/appointments")
        ]);
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (appointmentsRes.ok) {
          const appointmentsData = await appointmentsRes.json();
          setAppointments(appointmentsData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-[#0f172a] text-white rounded-[2rem] p-8 relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="text-xs font-bold text-[#f97316] uppercase tracking-widest bg-[#f97316]/10 px-3 py-1 rounded-full border border-[#f97316]/20">
            Clinical Overview
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">Welcome to Tulsi Hospitals Workspace</h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Real-time medical administration panel. Check occupancy, doctor logs, and patient records instantly.
          </p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Patients */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Patients</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.totalPatients ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Doctors */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Doctors on Duty</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.totalDoctors ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#f97316] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Stethoscope className="w-6 h-6" />
          </div>
        </div>

        {/* Scheduled Appointments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Appointments Scheduled</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.todayAppointments ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <CalendarDays className="w-6 h-6" />
          </div>
        </div>

        {/* Available Beds */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Beds Left</p>
            <p className="text-3xl font-extrabold text-slate-900">{stats?.availableBeds ?? 0}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Bed className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Appointments Queue</h3>
            <Link 
              href="/appointments" 
              className="text-xs font-bold text-[#f97316] hover:text-orange-600 flex items-center gap-1 transition-all"
            >
              View Full Calendar <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.length === 0 ? (
              <p className="text-sm text-slate-400 italic py-6 text-center">No active scheduled appointments found.</p>
            ) : (
              appointments.map((apt) => (
                <div key={apt.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-700">
                      {apt.patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{apt.patient.name}</h4>
                      <p className="text-xs text-slate-500">Dr. {apt.doctor.name} ({apt.doctor.specialization})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400 animate-pulse" />
                      {apt.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Administrative Actions */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">Quick Shortcuts</h3>
          <div className="flex flex-col gap-3">
            <Link 
              href="/patients"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 flex items-center justify-between group transition-all"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">Manage Patients</h4>
                <p className="text-xs text-slate-500 mt-0.5">Register, update, or remove patients</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            <Link 
              href="/wards"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 flex items-center justify-between group transition-all"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">Bed Occupancy</h4>
                <p className="text-xs text-slate-500 mt-0.5">Toggle live bed admissions/discharges</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </Link>

            <Link 
              href="/billing"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-orange-200 hover:bg-orange-50/30 flex items-center justify-between group transition-all"
            >
              <div>
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-orange-700 transition-colors">Billing Console</h4>
                <p className="text-xs text-slate-500 mt-0.5">Generate invoices & mark bills as paid</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
