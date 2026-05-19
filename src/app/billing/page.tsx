"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Receipt,
  FileText,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Activity
} from "lucide-react";

interface Patient {
  id: number;
  name: string;
}

interface Bill {
  id: number;
  patientId: number;
  amount: number;
  paymentStatus: string;
  description: string;
  createdAt: string;
  patient: Patient;
}

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bills, setBills] = useState<Bill[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState<Bill | null>(null);

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");

  const fetchData = async () => {
    try {
      const [billsRes, patientsRes] = await Promise.all([
        fetch("/api/bills"),
        fetch("/api/patients")
      ]);
      if (billsRes.ok) {
        const billsData = await billsRes.json();
        setBills(billsData);
      }
      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        setPatients(patientsData);
      }
    } catch (error) {
      console.error("Error fetching billing details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !amount || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(selectedPatientId),
          amount: parseFloat(amount),
          paymentStatus,
          description
        })
      });
      if (res.ok) {
        setIsModalOpen(false);
        // Reset form
        setSelectedPatientId("");
        setAmount("");
        setDescription("");
        setPaymentStatus("unpaid");
        fetchData();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayBill = async (id: number) => {
    try {
      const res = await fetch(`/api/bills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "paid" })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
    }
  };

  // Calculations
  const totalRevenue = bills
    .filter(b => b.paymentStatus.toLowerCase() === "paid")
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingPayments = bills
    .filter(b => b.paymentStatus.toLowerCase() === "unpaid")
    .reduce((sum, b) => sum + b.amount, 0);

  const totalOutstanding = bills.reduce((sum, b) => sum + b.amount, 0);

  const filteredBills = bills
    .filter(b => 
      b.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toString().includes(searchTerm)
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 -m-6 md:-m-8">
      {/* Premium Header Banner (Matching public layout) */}
      <div className="bg-[#0f172a] pt-12 pb-24 px-6 sm:px-12 relative overflow-hidden">
        {/* Glowing Ambient Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-[#f97316]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#f97316] uppercase tracking-widest bg-[#f97316]/10 border border-[#f97316]/20 px-3 py-1 rounded-full">
              Financial Administration
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Billing & Payments</h1>
            <p className="text-slate-300 text-base max-w-xl">Monitor, generate, and process hospital receipts, bills, and outstanding receivables in real-time.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-orange-600/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer self-stretch md:self-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8">
        
        {loading ? (
          <div className="flex justify-center items-center py-24 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <Loader2 className="w-10 h-10 animate-spin text-[#f97316]" />
          </div>
        ) : (
          <>
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Total Revenue Collected */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:shadow-[0_15px_35px_rgb(0,0,0,0.06)] transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Revenue Collected</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">₹ {totalRevenue.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Fully Cleared
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              </div>

              {/* Pending Receivables */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:shadow-[0_15px_35px_rgb(0,0,0,0.06)] transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Receivables</p>
                  <p className="text-3xl font-black text-red-600 tracking-tight">₹ {pendingPayments.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 inline-flex items-center gap-1 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> Awaiting Payment
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-7 h-7" />
                </div>
              </div>

              {/* Total Invoiced Amount */}
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between group hover:shadow-[0_15px_35px_rgb(0,0,0,0.06)] transition-all duration-300">
                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Invoiced</p>
                  <p className="text-3xl font-black text-blue-600 tracking-tight">₹ {totalOutstanding.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> All Generated Bills
                  </span>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <CreditCard className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Filters, Search & Connection */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by patient name or bill ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] focus:bg-white text-slate-700 placeholder:text-slate-400 transition-all text-sm font-semibold"
                />
              </div>
              <div className="flex items-center gap-3 self-stretch md:self-auto justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Secured Connection
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <Receipt className="w-3.5 h-3.5 text-blue-500" />
                  Live DB Synchronized
                </span>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden divide-y divide-slate-50">
              {filteredBills.map((bill) => (
                <div key={bill.id} className="p-6 hover:bg-slate-50/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-slate-500 shrink-0 border border-slate-200/60 shadow-sm">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">ID</span>
                      <span className="font-black text-slate-800 text-sm leading-none">#{bill.id}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#f97316] transition-colors">{bill.patient?.name || "Unassigned Patient"}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{bill.description}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          <Calendar className="w-3 h-3" />
                          {new Date(bill.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 md:gap-8 mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                    <div className="text-left md:text-right space-y-1">
                      <p className="font-black text-2xl text-slate-900 tracking-tight">₹ {bill.amount.toLocaleString("en-IN")}</p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border
                        ${bill.paymentStatus.toLowerCase() === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-red-50 text-red-700 border-red-100'}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${bill.paymentStatus.toLowerCase() === 'paid' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                        {bill.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {bill.paymentStatus.toLowerCase() !== 'paid' ? (
                        <button 
                          onClick={() => handlePayBill(bill.id)}
                          className="bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20 hover:bg-[#f97316] hover:text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-orange-500/20 active:scale-95"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-50 border border-slate-100 text-slate-400 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            Cleared
                          </span>
                          <button 
                            onClick={() => setSelectedReceiptBill(bill)}
                            className="bg-blue-50 hover:bg-blue-600 border border-blue-100 text-blue-700 hover:text-white px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1.5 active:scale-95"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Slip
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredBills.length === 0 && (
                <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <Receipt className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800">No invoices found</h3>
                    <p className="text-sm text-slate-400 max-w-sm">We couldn't locate any bill statements matching that description. Click "Create Invoice" above to add one.</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Premium Create Invoice Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight">Generate Invoice</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">Submit new medical transaction records.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all relative z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Patient Account</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm cursor-pointer"
                >
                  <option value="">-- Choose Patient Profile --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (PT-{p.id.toString().padStart(4, '0')})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Amount (INR)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Initial Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm cursor-pointer"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Billing Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Lab tests, medications, or ward consultation charges..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316] text-slate-800 font-bold transition-all text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3.5 border border-slate-200 text-slate-600 rounded-xl font-bold text-center hover:bg-slate-50 transition-all text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer shadow-md active:scale-95"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceiptBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-[#0f172a] text-white p-6 shrink-0 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight">Payment Receipt</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">Official hospital statement & proof of payment.</p>
              </div>
              <button 
                onClick={() => setSelectedReceiptBill(null)}
                className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all relative z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Body (Printable Area) */}
            <div id="printable-receipt-area" className="p-8 space-y-6 overflow-y-auto flex-1 bg-white text-slate-800">
              
              {/* Receipt Branding and Stamp */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <Activity className="text-white w-4 h-4" />
                    </div>
                    <span className="text-lg font-black text-slate-900 tracking-tight">Tulsi Hospitals</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Billing & Administration Division</p>
                  <p className="text-[10px] text-slate-400 font-medium">Near Central Metro, Hyderabad, India</p>
                </div>
                {/* PAID STAMP */}
                <div className="border-4 border-emerald-500/30 text-emerald-600 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl rotate-12 shrink-0 flex flex-col items-center justify-center bg-emerald-50/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-0.5" />
                  PAID & SECURED
                </div>
              </div>

              {/* Receipt Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Receipt Code</p>
                  <p className="font-bold text-slate-900 mt-0.5">REC-2026-{selectedReceiptBill.id.toString().padStart(4, '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {new Date(selectedReceiptBill.createdAt).toLocaleDateString("en-IN", { 
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                    })}
                  </p>
                </div>
                <div className="col-span-2 border-t border-slate-50 pt-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Billed Patient</p>
                  <p className="font-black text-slate-900 text-sm mt-0.5">{selectedReceiptBill.patient?.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Patient Record ID: PT-{selectedReceiptBill.patientId.toString().padStart(4, '0')}</p>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="border-t border-b border-slate-100 py-4 my-2">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                  <span>Billing Description</span>
                  <span>Total Amount</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="max-w-[70%] space-y-1">
                    <p className="font-bold text-slate-900">{selectedReceiptBill.description}</p>
                    <p className="text-xs text-slate-500">Includes consultation, lab tests, and hospital administrative fees.</p>
                  </div>
                  <span className="font-black text-slate-900 text-base">₹ {selectedReceiptBill.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount Settled</span>
                  <p className="text-xs text-slate-500 mt-0.5">Cleared via Authorized Digital Gateway</p>
                </div>
                <span className="text-2xl font-black text-emerald-600 tracking-tight">₹ {selectedReceiptBill.amount.toLocaleString("en-IN")}</span>
              </div>

              {/* Stamp & Disclaimer */}
              <div className="text-center pt-4 space-y-2 border-t border-slate-100">
                <div className="flex items-center justify-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Tulsi Hospitals Accounts Division
                </div>
                <p className="text-[9px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  This is a system-generated electronic receipt and does not require a physical signature. Settled bills are legally binding and protected under patient privacy laws.
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedReceiptBill(null)}
                className="flex-1 py-3.5 border border-slate-200 text-slate-600 bg-white rounded-xl font-bold text-center hover:bg-slate-50 transition-all text-sm cursor-pointer shadow-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const printContents = document.getElementById("printable-receipt-area")?.innerHTML;
                  if (printContents) {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Receipt_REC-2026-${selectedReceiptBill.id}</title>
                            <style>
                              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.5; }
                              .flex { display: flex; }
                              .justify-between { justify-content: space-between; }
                              .items-start { align-items: flex-start; }
                              .items-center { align-items: center; }
                              .flex-col { flex-direction: column; }
                              .text-center { text-align: center; }
                              .border-b { border-bottom: 1px solid #e2e8f0; }
                              .border-t { border-top: 1px solid #e2e8f0; }
                              .pb-6 { padding-bottom: 24px; }
                              .pt-3 { padding-top: 12px; }
                              .py-4 { padding-top: 16px; padding-bottom: 16px; }
                              .my-2 { margin-top: 8px; margin-bottom: 8px; }
                              .space-y-1 > * { margin-bottom: 4px; }
                              .space-y-2 > * { margin-bottom: 8px; }
                              .text-xs { font-size: 12px; }
                              .text-sm { font-size: 14px; }
                              .text-lg { font-size: 18px; }
                              .text-2xl { font-size: 24px; }
                              .font-bold { font-weight: 700; }
                              .font-black { font-weight: 900; }
                              .uppercase { text-transform: uppercase; }
                              .tracking-widest { letter-spacing: 0.1em; }
                              .text-slate-400 { color: #94a3b8; }
                              .text-slate-500 { color: #64748b; }
                              .text-slate-900 { color: #0f172a; }
                              .text-emerald-600 { color: #059669; }
                              .border-4 { border: 4px solid rgba(16, 185, 129, 0.2); }
                              .px-4 { padding-left: 16px; padding-right: 16px; }
                              .py-2 { padding-top: 8px; padding-bottom: 8px; }
                              .rounded-xl { border-radius: 12px; }
                              .rotate-12 { transform: rotate(5deg); }
                              .bg-slate-50 { background-color: #f8fafc; padding: 16px; border-radius: 16px; }
                              .max-w-xs { max-width: 320px; }
                              .mx-auto { margin-left: auto; margin-right: auto; }
                            </style>
                          </head>
                          <body>
                            ${printContents}
                            ${'<' + 'script>'}
                              window.onload = function() {
                                window.print();
                                setTimeout(function() { window.close(); }, 500);
                              };
                            ${'<' + '/script>'}
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }
                }}
                className="flex-1 py-3.5 bg-[#f97316] hover:bg-orange-600 text-white rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-orange-500/20 active:scale-95"
              >
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
