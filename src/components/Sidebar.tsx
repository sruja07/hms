"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  Bed,
  CreditCard,
  Menu,
  X,
  Activity,
  Home
} from "lucide-react";

const navigation = [
  { name: "Home (Portal)", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "Doctors", href: "/doctors", icon: Stethoscope },
  { name: "Appointments", href: "/appointments", icon: CalendarDays },
  { name: "Wards & Beds", href: "/wards", icon: Bed },
  { name: "Hospitals", href: "/hospitals", icon: Activity },
  { name: "Billing", href: "/billing", icon: CreditCard },
];

export function Sidebar({ userRole = "staff", onLogout }: { userRole?: string; onLogout?: () => void }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Activity className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-slate-900">Tulsi Hospitals</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-72 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link 
          href="/" 
          className="p-6 flex items-center gap-3 border-b border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform shrink-0">
            <Activity className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-none">Tulsi Hospitals</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1.5">Hospital Portal →</p>
          </div>
        </Link>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                      }`}
                    />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-5 rounded-full bg-blue-600" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
              {userRole === "admin" ? "AD" : "ST"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 leading-none truncate">
                {userRole === "admin" ? "Admin User" : "Staff Member"}
              </p>
              <span className="text-[9px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1.5 inline-block">
                {userRole}
              </span>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-100 shadow-sm"
            >
              🔒 Lock Workspace
            </button>
          )}
        </div>
      </nav>
    </>
  );
}
