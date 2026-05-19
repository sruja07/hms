"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Cross,
  ChevronDown,
  Phone,
  Search,
  Bell,
  ChevronRight,
  Home,
  MapPin,
  Mail,
  PhoneCall,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navigation = [
  {
    name: "DISCOVER TULSI HOSPITALS",
    href: "/",
    dropdown: {
      type: "dynamic",
      items: [
        {
          title: "The Tulsi Hospitals Story",
          content: [
            "Overview",
            "Tulsi AIIMS Bhopal",
            "Tulsi Bansal Hospital",
            "Alliances",
          ],
        },
        {
          title: "Leadership",
          content: [
            "Board of Directors",
            "Executive Management",
            "Medical Advisory Board",
            "Clinical Leaders",
            "Founders",
          ],
        },
        {
          title: "Academics & Research",
          content: [
            "Research Institute",
            "Clinical Trials",
            "Medical Education",
            "Fellowship Programs",
            "Publications",
            "Innovation Hub",
          ],
        },
        {
          title: "CSR & Sustainability",
          content: [
            "Community Outreach",
            "Green Hospital Initiatives",
            "Free Clinics",
            "Health Camps",
            "Annual CSR Report",
          ],
        },
        {
          title: "Corporate Governance",
          content: [
            "Board Committees",
            "Policies",
            "Code of Conduct",
            "Investor Information",
            "Financial Reports",
          ],
        },
        {
          title: "Media Centre",
          content: [
            "Press Releases",
            "Tulsi Lilavati Hospital",
            "Tulsi Kokilaben Hospital",
            "Tulsi Fortis Hospital Mumbai",
            "Contact Media Relations",
          ],
        },
      ],
    },
  },
  {
    name: "FIND HOSPITAL",
    href: "/hospitals",
    dropdown: {
      type: "locations",
      cities: [
        {
          name: "Delhi",
          hospitals: [
            "Tulsi AIIMS Delhi",
            "Tulsi Max Super Speciality Hospital",
            "Tulsi Fortis Escorts Heart Institute",
          ],
        },
        {
          name: "Mumbai",
          hospitals: [
            "Tulsi Lilavati Hospital",
            "Tulsi Kokilaben Hospital",
            "Tulsi Fortis Hospital Mumbai",
          ],
        },
        {
          name: "Bangalore",
          hospitals: [
            "Tulsi Manipal Hospital",
            "Tulsi Fortis Hospital",
            "Tulsi Narayana Health City",
          ],
        },
        {
          name: "Hyderabad",
          hospitals: [
            "Tulsi Apollo Hospital Hyderabad",
            "Tulsi Yashoda Hospital",
            "Tulsi KIMS Hospital",
          ],
        },
        {
          name: "Chennai",
          hospitals: [
            "Tulsi Apollo Hospital Chennai",
            "Tulsi Fortis Malar Hospital",
            "Tulsi MIOT International",
          ],
        },
      ],
    },
  },
  {
    name: "MEDICAL SERVICES",
    href: "/doctors",
    dropdown: {
      type: "dynamic",
      items: [
        {
          title: "Centres of Excellence",
          content: [
            "Cardiology (Heart Care)",
            "Neurology & Neurosurgery",
            "Orthopaedics",
            "Oncology (Cancer Care)",
            "Gastroenterology",
            "Transplants",
          ],
        },
        {
          title: "Specialities",
          content: [
            "Dermatology",
            "Endocrinology",
            "Pediatrics",
            "Pulmonology",
            "Urology",
            "Psychiatry",
            "Rheumatology",
            "Ophthalmology",
          ],
        },
        {
          title: "Procedures & Surgeries",
          content: [
            "Robotic Surgery",
            "Bariatric Surgery",
            "Joint Replacement",
            "Spine Surgery",
            "Cochlear Implant",
            "Bone Marrow Transplant",
          ],
        },
        {
          title: "Diagnostics & Imaging",
          content: [
            "MRI & CT Scan",
            "X-Ray & Ultrasound",
            "Endoscopy",
            "Pathology Lab",
            "Blood Bank",
            "Genetic Testing",
          ],
        },
        {
          title: "Emergency & Critical Care",
          content: [
            "24/7 Emergency",
            "ICU & NICU",
            "Tulsi AIIMS Delhi",
            "Tulsi Max Super Speciality Hospital",
            "Tulsi Fortis Escorts Heart Institute",
          ],
        },
      ],
    },
  },
  {
    name: "HEALTH LIBRARY",
    href: "/patients",
    dropdown: {
      type: "dynamic",
      items: [
        {
          title: "Diseases and Conditions",
          content: [
            "Amyotrophic Lateral Sclerosis (ALS)",
            "Epilepsy",
            "PCOD/PCOS",
            "Bone Marrow Transplant",
            "Hantavirus",
            "Parkinson's Disease",
            "Brain Cancer",
            "Hypertension",
            "Rheumatoid Arthritis",
            "Breast Cancer",
            "Irritable Bowel Syndrome (IBS)",
            "Skin Conditions",
            "Chronic Kidney Disease",
            "Kidney Stones",
            "Stroke",
            "Colorectal Cancer",
            "Leukemia",
            "Thyroid Disorders",
            "Coronary Artery Disease",
            "Liver Cirrhosis",
            "View All >",
            "Diabetes Mellitus",
            "Osteoarthritis",
          ],
        },
        {
          title: "Treatments & Procedures",
          content: [
            "Chemotherapy",
            "Radiation Therapy",
            "Dialysis",
            "Physical Therapy",
            "Angioplasty",
            "Pacemaker Insertion",
            "Organ Transplant",
            "Immunotherapy",
          ],
        },
        {
          title: "Symptoms Guide",
          content: [
            "Chest Pain",
            "Shortness of Breath",
            "Chronic Fatigue",
            "Joint Pain",
            "Fever & Chills",
            "Unexplained Weight Loss",
            "Severe Headaches",
            "Digestive Issues",
          ],
        },
        {
          title: "Health Technology",
          content: [
            "Telemedicine",
            "Wearable Health Monitors",
            "AI in Diagnostics",
            "Robotic Surgery Options",
            "Electronic Health Records",
            "Mobile Health Apps",
          ],
        },
        {
          title: "Medicines",
          content: [
            "Antibiotics Guide",
            "Pain Management",
            "Cardiovascular Drugs",
            "Diabetes Medications",
            "Vaccine Schedule",
            "Drug Interactions Checker",
            "Pharmacy Locator",
          ],
        },
        {
          title: "Diagnostics & Tests",
          content: [
            "Complete Blood Count (CBC)",
            "Lipid Panel",
            "Tulsi Manipal Hospital",
            "Tulsi Fortis Hospital",
            "Tulsi Narayana Health City",
            "CT Scan Prep",
            "Ultrasound Guide",
          ],
        },
      ],
    },
  },
];

export function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  // Close contact dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        contactRef.current &&
        !contactRef.current.contains(event.target as Node)
      ) {
        setShowContact(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavHover = (name: string) => {
    setHoveredNav(name);
    setActiveSubIndex(0); // Reset to first item when opening a new dropdown
  };

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${isHome ? "absolute top-0 left-0 bg-gradient-to-b from-black/80 to-transparent" : "bg-[#0f172a] sticky top-0"} ${hoveredNav ? "bg-[#0f172a]" : ""}`}
      onMouseLeave={() => setHoveredNav(null)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 mr-8">
            <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center">
              <Cross className="text-[#0f172a] w-5 h-5 fill-[#0f172a]" />
            </div>
            <Link
              href="/"
              className="font-bold text-xl tracking-tight text-white flex flex-col leading-tight"
            >
              <span>Tulsi</span>
              <span className="text-xs font-normal tracking-widest text-slate-300">
                HOSPITALS
              </span>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 h-full">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="h-full flex items-center"
                onMouseEnter={() => handleNavHover(item.name)}
              >
                <Link
                  href={item.href}
                  className="text-white text-[11px] font-bold tracking-wider hover:text-teal-400 flex items-center gap-1 transition-colors h-full px-2"
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  )}
                </Link>
              </div>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4 relative">
            {/* Home Button */}
            <Link
              href="/"
              className="w-8 h-8 rounded-full bg-teal-600/80 flex items-center justify-center text-white hover:bg-teal-500 transition-colors shadow-sm"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Link>

            {/* Call / Contact Button */}
            <div ref={contactRef}>
              <button
                onClick={() => setShowContact(!showContact)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors shadow-sm ${showContact ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-400"}`}
                title="Contact & Support"
              >
                <Phone className="w-4 h-4 fill-white" />
              </button>

              {/* Contact Dropdown Popover */}
              {showContact && (
                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 text-white">
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      <PhoneCall className="w-5 h-5" /> 24/7 Helpline
                    </h4>
                    <p className="text-yellow-50 text-sm mt-1">
                      We are here for you, anytime.
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          General Inquiry
                        </p>
                        <p className="text-slate-900 font-bold">
                          1-800-HEALTH-SYNC
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <PhoneCall className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Emergency Ambulance
                        </p>
                        <p className="text-red-600 font-bold text-lg">911</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Main Campus
                        </p>
                        <p className="text-slate-700 text-sm">
                          123 Wellness Way, MedCity
                          <br />
                          New York, NY 10001
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Email Support
                        </p>
                        <p className="text-teal-600 font-medium text-sm">
                          support@tulsihospitals.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
                    <Link
                      href="/appointments?action=book"
                      className="text-sm font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wide"
                    >
                      Book Appointment Online →
                    </Link>
                  </div>
                </div>
              )}
            </div>


            <Link
              href="/dashboard"
              className="hidden sm:flex items-center bg-[#f97316] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-[#ea580c] transition-colors shadow-md gap-1"
            >
              Clinical Workspace 🩺
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Mega Menus Overlay */}
      {hoveredNav &&
        navigation.find((n) => n.name === hoveredNav)?.dropdown && (
          <div className="absolute top-full left-0 w-full bg-[#fcf8f5] shadow-2xl border-t border-slate-200 py-10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Dynamic Layout */}
              {navigation.find((n) => n.name === hoveredNav)?.dropdown?.type ===
                "dynamic" && (
                <div className="flex min-h-[300px]">
                  {/* Left Panel - Options */}
                  <div className="w-1/3 border-r border-slate-200 pr-8">
                    <ul className="space-y-4">
                      {navigation
                        .find((n) => n.name === hoveredNav)
                        ?.dropdown?.items?.map((item, i) => (
                          <li key={i}>
                            <button
                              onMouseEnter={() => setActiveSubIndex(i)}
                              onClick={() => setActiveSubIndex(i)}
                              className={`w-full text-left font-semibold text-sm flex items-center justify-between group transition-colors ${
                                activeSubIndex === i
                                  ? "text-teal-700"
                                  : "text-slate-700 hover:text-teal-600"
                              }`}
                            >
                              {item.title}
                              <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                  activeSubIndex === i
                                    ? "text-teal-600 translate-x-1"
                                    : "text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1"
                                }`}
                              />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Right Panel - Dynamic Content */}
                  <div className="w-2/3 pl-12">
                    <h3 className="text-xl font-serif font-bold text-slate-900 mb-6 border-b border-slate-200 pb-2">
                      {
                        navigation.find((n) => n.name === hoveredNav)?.dropdown
                          ?.items?.[activeSubIndex]?.title
                      }
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                      {navigation
                        .find((n) => n.name === hoveredNav)
                        ?.dropdown?.items?.[activeSubIndex]?.content?.map(
                          (link: string, i: number) => {
                            const isViewAll = link.includes("View All");
                            const slug = link
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/(^-|-$)/g, "");
                            const href = isViewAll
                              ? "/health-library"
                              : `/health-library/${slug}`;

                            return (
                              <Link
                                key={i}
                                href={href}
                                className={`text-slate-600 hover:text-teal-700 text-sm font-medium flex items-center gap-2 group ${isViewAll ? "text-slate-900 font-bold" : ""}`}
                              >
                                {!isViewAll && (
                                  <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-teal-500 transition-colors flex-shrink-0"></span>
                                )}
                                {link}
                              </Link>
                            );
                          },
                        )}
                    </div>
                  </div>
                </div>
              )}

              {/* Locations Layout (Find Hospital) */}
              {navigation.find((n) => n.name === hoveredNav)?.dropdown?.type ===
                "locations" && (
                <div className="grid grid-cols-5 gap-8">
                  {navigation
                    .find((n) => n.name === hoveredNav)
                    ?.dropdown?.cities?.map((city, i) => (
                      <div key={i}>
                        <h4 className="font-bold text-slate-900 mb-4 text-sm">
                          {city.name}
                        </h4>
                        <ul className="space-y-3">
                          {(city.hospitals || []).map(
                            (hospital: string, j: number) => (
                              <li key={j}>
                                <Link
                                  href={`/hospitals?city=${city.name}`}
                                  className="text-slate-500 hover:text-teal-700 text-xs transition-colors"
                                >
                                  {hospital}
                                </Link>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
    </nav>
  );
}
