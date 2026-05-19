"use client";

import { useState, useRef } from "react";
import { CheckCircle2, Upload, Send, FileText, X, Loader2, Sparkles } from "lucide-react";

export default function SecondOpinionPage() {
  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [condition, setCondition] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  // Interaction states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger file click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Clear file error if any
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!name.trim()) newErrors.name = "Patient Name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone Number is required";
    } else if (!/^\d{10}$/.test(phone.replace(/[\s-+]/g, "").slice(-10))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!condition.trim()) newErrors.condition = "Medical condition is required";
    if (!file) newErrors.file = "Please upload at least one medical report";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit Simulation
    setIsSubmitting(true);
    setErrors({});

    setTimeout(() => {
      // Generate authentic reference code
      const cleanPhone = phone.replace(/[\s-+]/g, "").slice(-4);
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const refCode = `TSO-${randNum}-${cleanPhone}`;

      setReferenceNumber(refCode);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  // Reset form
  const handleReset = () => {
    setName("");
    setPhone("");
    setCondition("");
    setFile(null);
    setSubmitted(false);
    setReferenceNumber("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      {/* Header Banner */}
      <div className="bg-[#0f172a] py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight relative z-10 animate-in fade-in duration-500">Expert Second Opinion</h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto relative z-10 font-medium">
          Make informed medical decisions with confidence. Consult our world-class specialists for a comprehensive review of your diagnosis.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24">
          {/* Left Image */}
          <div className="w-full lg:w-5/12">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800" 
                alt="Medical Team" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 border-4 border-white/20 rounded-3xl pointer-events-none"></div>
            </div>
          </div>

          {/* Right Text */}
          <div className="w-full lg:w-7/12">
            <span className="text-[#f97316] font-bold text-xs uppercase tracking-widest bg-orange-500/10 px-3.5 py-1.5 rounded-full mb-4 inline-block">
              Clinical Integrity
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] mb-6 leading-tight tracking-tight">
              Why Consider a Second Opinion at <span className="text-[#f97316]">Tulsi Hospitals</span>?
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Tulsi Hospitals stands as a beacon of healthcare expertise, backed by a legacy of pioneering achievements. Our commitment to clinical excellence and innovative practices has positioned us as the region's leading integrated healthcare services provider.
              </p>
              <p>
                With a team of renowned specialists and access to cutting-edge medical technologies, we offer unparalleled expertise in diagnosing as well as treating a wide array of simple to the most complex medical conditions.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                "Confirm a complex diagnosis with certainty",
                "Explore advanced alternative treatment options",
                "Gain peace of mind before a major procedure"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#f97316] shrink-0" />
                  <span className="text-slate-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Request Form & Success Section */}
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            /* Premium Success State Card */
            <div className="bg-white rounded-[2.5rem] border border-emerald-100 p-8 sm:p-12 shadow-xl shadow-emerald-500/5 text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Request Submitted Successfully!</h3>
              <p className="text-slate-500 max-w-xl mx-auto mb-8 text-base">
                Thank you, <strong className="text-slate-800">{name}</strong>! Your medical records and second opinion request for <strong className="text-slate-800">{condition}</strong> have been securely transferred to our clinical team.
              </p>

              {/* Reference Case Ticket Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 mb-8 max-w-md mx-auto relative">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-white border-r border-slate-200 rounded-r-full"></div>
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-6 bg-white border-l border-slate-200 rounded-l-full"></div>
                
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Case Reference Number</p>
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-mono text-2xl font-black text-slate-800 tracking-wider">{referenceNumber}</span>
                  <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                </div>
                <div className="border-t border-dashed border-slate-200 my-4"></div>
                <div className="text-left space-y-2 text-xs font-medium text-slate-500">
                  <div className="flex justify-between">
                    <span>Contact Phone:</span>
                    <span className="text-slate-800 font-bold">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded File:</span>
                    <span className="text-slate-800 font-bold truncate max-w-[200px]">{file?.name}</span>
                  </div>
                </div>
              </div>

              {/* Steps block */}
              <div className="max-w-md mx-auto text-left bg-blue-50/50 border border-blue-100 rounded-2xl p-5 mb-10 text-slate-600 text-sm">
                <p className="font-bold text-blue-900 mb-2">📋 What happens next?</p>
                <ol className="list-decimal pl-4 space-y-1 text-xs leading-relaxed font-semibold text-blue-950">
                  <li>Our department lead will assign your case to the corresponding senior specialist.</li>
                  <li>The doctor will thoroughly evaluate your uploaded diagnostic reports.</li>
                  <li>We will contact you at <span className="underline">{phone}</span> within 24 hours with a comprehensive summary.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={handleReset}
                  className="py-3.5 px-6 rounded-xl font-bold text-sm text-[#0f172a] bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Submit Another Request
                </button>
                <a 
                  href="/"
                  className="py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#0f172a] hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center"
                >
                  Return to Home Portal
                </a>
              </div>
            </div>
          ) : (
            /* Active Form Block */
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-12 shadow-md relative">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Request Your Second Opinion</h3>
                <p className="text-slate-500">Please provide your details and medical reports. Our care team will connect you with the right specialist.</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Patient Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-[#f97316] focus:ring-[#f97316]"} focus:ring-1 outline-none transition-all text-sm font-semibold`} 
                      placeholder="e.g. Veeresh" 
                    />
                    {errors.name && <p className="text-red-500 text-xs font-bold">{errors.name}</p>}
                  </div>
                  
                  {/* Phone field */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-[#f97316] focus:ring-[#f97316]"} focus:ring-1 outline-none transition-all text-sm font-semibold`} 
                      placeholder="e.g. 8965231475" 
                    />
                    {errors.phone && <p className="text-red-500 text-xs font-bold">{errors.phone}</p>}
                  </div>
                </div>

                {/* Condition field */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Medical Condition / Primary Diagnosis</label>
                  <input 
                    type="text" 
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.condition ? "border-red-400 focus:ring-red-400" : "border-slate-300 focus:border-[#f97316] focus:ring-[#f97316]"} focus:ring-1 outline-none transition-all text-sm font-semibold`} 
                    placeholder="e.g. Orthopedics, Cardiology, specific condition" 
                  />
                  {errors.condition && <p className="text-red-500 text-xs font-bold">{errors.condition}</p>}
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden" 
                />

                {/* Interactive Drag & Drop Box */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Upload Medical Reports (PDF, JPG)</label>
                  
                  {file ? (
                    /* Display Selected File Details */
                    <div className="border border-slate-200 bg-slate-50 rounded-xl p-5 flex items-center gap-4 relative animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-6 h-6 text-[#f97316]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 text-sm font-bold truncate">{file.name}</p>
                        <p className="text-slate-400 text-xs font-semibold">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • Diagnostic Document
                        </p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFile(null)} 
                        className="w-8 h-8 rounded-lg bg-white border hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors flex items-center justify-center text-slate-400 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    /* Clickable Box if empty */
                    <div 
                      onClick={triggerFileInput}
                      className={`border-2 border-dashed ${errors.file ? "border-red-300 hover:bg-red-50/20" : "border-slate-300 hover:border-[#f97316] hover:bg-slate-100/50"} rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center`}
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-3" />
                      <p className="text-slate-600 font-bold mb-1">Click to upload or drag and drop</p>
                      <p className="text-slate-400 text-xs font-semibold">Max file size 10MB (PDF, JPG, PNG)</p>
                    </div>
                  )}
                  {errors.file && <p className="text-red-500 text-xs font-bold">{errors.file}</p>}
                </div>

                {/* Submit Action */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white bg-[#0f172a] hover:bg-slate-800 disabled:bg-slate-400 shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 group mt-8 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      Submit Request <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
