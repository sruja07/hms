"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const departments = [
  "CARDIAC SCIENCES",
  "ONCOLOGY",
  "NEUROSCIENCES",
  "GASTROENTEROLOGY",
  "ORTHOPAEDICS",
  "TRANSPLANTS",
];

const departmentData: Record<string, any> = {
  "CARDIAC SCIENCES": {
    title: "Cardiac Sciences",
    description: "Our Cardiac Sciences department is at the forefront of cardiac care, offering a comprehensive range of services from advanced diagnostics and minimally invasive procedures to complex heart surgeries. We provide world-class cardiovascular treatments with unmatched clinical outcomes.",
    procedures: ["HEART TRANSPLANT", "CORONARY ARTERY BYPASS", "VALVE REPLACEMENT"],
    image: "/departments/cardiac.png"
  },
  "ONCOLOGY": {
    title: "Oncology",
    description: "The Oncology centre offers comprehensive cancer care with multidisciplinary tumor boards, advanced radiation therapy, targeted chemotherapy, and complex surgical oncology. Our focus is on personalized treatments for better survivorship.",
    procedures: ["CHEMOTHERAPY", "RADIATION THERAPY", "BONE MARROW TRANSPLANT"],
    image: "/departments/oncology.png"
  },
  "NEUROSCIENCES": {
    title: "Neurosciences",
    description: "Our Neurosciences institute brings together expert neurologists and neurosurgeons to treat complex disorders of the brain and spine, utilizing advanced neuro-navigation and minimally invasive techniques.",
    procedures: ["BRAIN TUMOR SURGERY", "SPINE SURGERY", "STROKE MANAGEMENT"],
    image: "/departments/neuro.png"
  },
  "GASTROENTEROLOGY": {
    title: "Gastroenterology",
    description: "Providing state-of-the-art care for digestive and liver diseases, our gastroenterology department specializes in advanced endoscopy, hepatology, and comprehensive gastrointestinal surgeries.",
    procedures: ["ENDOSCOPY", "LIVER TRANSPLANT", "COLONOSCOPY"],
    image: "/departments/gastro.png"
  },
  "ORTHOPAEDICS": {
    title: "Orthopaedics",
    description: "Leading the way in musculoskeletal care, our orthopaedics centre excels in joint replacements, sports medicine, trauma care, and complex spine surgeries, ensuring rapid recovery and mobility.",
    procedures: ["KNEE REPLACEMENT", "HIP REPLACEMENT", "ARTHROSCOPY"],
    image: "/departments/ortho.png"
  },
  "TRANSPLANTS": {
    title: "Transplants",
    description: "As a pioneer in multi-organ transplantation, we have a highly successful program for liver, kidney, heart, and lung transplants, backed by state-of-the-art ICUs and dedicated transplant teams.",
    procedures: ["KIDNEY TRANSPLANT", "LIVER TRANSPLANT", "LUNG TRANSPLANT"],
    image: "/departments/transplant.png"
  }
};

export default function CentresOfExcellence() {
  const [activeTab, setActiveTab] = useState(departments[0]);
  const data = departmentData[activeTab];
  const currentIndex = departments.indexOf(activeTab);

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? departments.length - 1 : currentIndex - 1;
    setActiveTab(departments[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex === departments.length - 1 ? 0 : currentIndex + 1;
    setActiveTab(departments[nextIndex]);
  };

  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16 bg-[#f0f9fa]">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-light text-[#0f172a] leading-tight">
            Clinical Excellence At Our Hospital – <span className="font-semibold">India's Leading Multispeciality Healthcare Network</span>
          </h2>
          <div className="text-slate-600 space-y-4 text-sm md:text-base leading-relaxed">
            <p>
              At our hospital, we deliver world-class healthcare by combining advanced medical technology with the expertise of highly experienced specialists across key clinical disciplines. Our comprehensive, specialty-driven centres of excellence are designed to address diverse healthcare needs, consistently delivering strong clinical outcomes and seamless care experiences for patients across India.
            </p>
            <p>
              From preventive health check-ups and routine consultations to complex and advanced treatments, we are trusted for personalised, compassionate, and high-quality care at every stage of the patient journey. Supported by an integrated care ecosystem spanning outpatient services, inpatient care, advanced surgery, emergency medicine, and rehabilitation, we continue to set benchmarks in clinical excellence and patient safety nationwide.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 mt-4">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveTab(dept)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all duration-300
                ${activeTab === dept 
                  ? 'bg-[#0f172a] text-white border-[#0f172a]' 
                  : 'bg-transparent text-[#008296] border-[#008296] hover:bg-[#008296]/10'
                }
              `}
            >
              {dept}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full border border-[#008296] text-[#008296] flex items-center justify-center hover:bg-[#008296]/10 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area with Carousel Navigation */}
        <div className="relative mt-6 flex items-center gap-4">
          {/* Left Arrow */}
          <button 
            onClick={handlePrevious}
            className="hidden md:flex w-12 h-12 rounded-full bg-[#9bc7cc] items-center justify-center text-white hover:bg-[#008296] transition-colors shrink-0 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-[2rem] w-full flex flex-col lg:flex-row overflow-hidden shadow-sm border border-white relative min-h-[400px]">
            {/* Text Content */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-semibold text-[#0f172a]">{data.title}</h3>
                <p className="text-slate-600 leading-relaxed max-w-xl">
                  {data.description}
                </p>
              </div>

              <div className="mt-12">
                <h4 className="text-[#0f172a] font-medium mb-4">Top Specialties & Procedures</h4>
                <div className="flex flex-wrap gap-3">
                  {data.procedures.map((proc: string) => (
                    <span key={proc} className="px-4 py-1.5 rounded-full border border-[#e2e8f0] text-[#008296] text-xs font-semibold tracking-wide shadow-sm bg-white">
                      {proc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Image Content */}
            <div key={activeTab} className="relative w-full lg:w-[45%] min-h-[250px] lg:min-h-full">
              {data.image ? (
                <div className="absolute inset-0 p-4 md:p-6 lg:p-8 pl-0">
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg">
                    <img
                      key={activeTab}
                      src={data.image}
                      alt={data.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-100 m-8 rounded-2xl"></div>
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={handleNext}
            className="hidden md:flex w-12 h-12 rounded-full bg-[#008296] items-center justify-center text-white hover:bg-[#0f172a] transition-colors shrink-0 z-10 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

      </div>
    </section>
  );
}
