import Link from "next/link";
import { ChevronRight, CalendarDays, Stethoscope, ArrowRight, Activity, CheckCircle2 } from "lucide-react";
import { libraryData, getFallbackContent } from "./content";

export default async function HealthLibraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "condition";
  
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // Get accurate medical data or intelligent fallback
  const contentData = libraryData[slug] || getFallbackContent(title, slug);
  const isDisease = contentData.type === "disease";

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-[#0f172a] pt-32 pb-24 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-teal-400 font-medium mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/health-library" className="hover:text-white transition-colors">Health Library</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{title}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{title}</h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {isDisease 
              ? `Comprehensive medical information, expert insights, and treatment options regarding ${title}.`
              : `Expert medical guidance and detailed information regarding ${title} at Tulsi Hospitals.`
            }
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-sm border border-slate-200 p-4 sticky top-28">
            <h3 className="font-bold text-slate-900 mb-4 px-3">On this page</h3>
            <ul className="space-y-1">
              <li><a href="#overview" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">Overview</a></li>
              
              {isDisease ? (
                <>
                  <li><a href="#symptoms" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">Symptoms</a></li>
                  <li><a href="#causes" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">Causes & Risk Factors</a></li>
                  <li><a href="#treatments" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">Treatments</a></li>
                </>
              ) : (
                <>
                  <li><a href="#details" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">In-Depth Details</a></li>
                  <li><a href="#expectations" className="block px-3 py-2 text-sm text-slate-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors font-medium">What to Expect</a></li>
                </>
              )}
            </ul>
          </div>

          {/* Right Content Details */}
          <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-sm border border-slate-200 p-8 lg:p-12">
            
            <section id="overview" className="mb-12 scroll-mt-28">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Overview</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                {contentData.overview}
              </p>
            </section>

            {isDisease ? (
              <>
                <section id="symptoms" className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    Common Symptoms
                  </h2>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {contentData.symptoms.map((symptom: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 flex-shrink-0 shadow-sm"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="causes" className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Causes & Risk Factors</h2>
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    {contentData.causes}
                  </p>
                </section>

                <section id="treatments" className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Treatments & How to Overcome</h2>
                  <div className="space-y-4 mb-8">
                    {contentData.treatments.map((treatment: any, i: number) => (
                      <div key={i} className="p-5 border border-slate-200 bg-white rounded-xl hover:border-teal-300 transition-colors shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-2">{i + 1}. {treatment.title}</h4>
                        <p className="text-slate-600 text-sm">{treatment.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                <section id="details" className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
                      <Activity className="w-4 h-4" />
                    </div>
                    In-Depth Details
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg mb-6">
                    {contentData.details}
                  </p>
                </section>

                <section id="expectations" className="mb-12 scroll-mt-28">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">What to Expect</h2>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                    <ul className="space-y-4">
                      {contentData.expectations.map((exp: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                          <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              </>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-8 text-center text-white mt-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Don't Wait. Get Expert Help Today.</h3>
              <p className="text-slate-300 mb-8 max-w-lg mx-auto">
                Consult with our specialized doctors to get a precise diagnosis and a custom treatment plan.
              </p>
              <Link href="/appointments?action=book" className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-teal-500/30">
                <CalendarDays className="w-5 h-5" />
                Book an Appointment
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
