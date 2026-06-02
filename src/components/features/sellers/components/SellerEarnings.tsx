"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, DownloadCloud } from "lucide-react";
import { User } from "@/lib/api/services/auth.service";

// Mock Data
const TRANSACTIONS = [
  { id: "TX-1049", type: "Sale", amount: "+$29.00", fee: "-$2.90", net: "+$26.10", date: "Today, 10:45 AM", status: "Completed" },
  { id: "TX-1048", type: "Sale", amount: "+$19.00", fee: "-$1.90", net: "+$17.10", date: "Yesterday, 3:20 PM", status: "Completed" },
  { id: "PO-502", type: "Payout", amount: "-$450.00", fee: "$0.00", net: "-$450.00", date: "May 28, 2026", status: "Completed" },
  { id: "TX-1047", type: "Sale", amount: "+$49.00", fee: "-$4.90", net: "+$44.10", date: "May 27, 2026", status: "Completed" },
  { id: "TX-1046", type: "Sale", amount: "+$29.00", fee: "-$2.90", net: "+$26.10", date: "May 26, 2026", status: "Completed" },
];

export default function SellerEarnings({ user }: { user: User | null }) {
  const [requestingPayout, setRequestingPayout] = useState(false);

  const handlePayoutRequest = () => {
    setRequestingPayout(true);
    setTimeout(() => {
      setRequestingPayout(false);
      alert("Payout request submitted successfully! Funds will arrive in 2-3 business days.");
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#103B40] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
          <p className="text-white/70 text-sm font-medium mb-1 relative z-10">Available for Payout</p>
          <h2 className="text-4xl font-bold mb-4 relative z-10">$845.20</h2>
          <button 
            onClick={handlePayoutRequest}
            disabled={requestingPayout}
            className="w-full py-2.5 bg-[#43B0B5] hover:bg-[#389b9f] transition-colors rounded-xl font-bold text-sm shadow-sm relative z-10 flex items-center justify-center gap-2"
          >
            {requestingPayout ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Request Payout</>
            )}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Earnings (All Time)</p>
          <h2 className="text-3xl font-bold text-gray-900">$12,450.80</h2>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-2">
            <ArrowUpRight size={16} />
            +$2,450 this month
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Pending Clearance</p>
          <h2 className="text-3xl font-bold text-gray-900">$124.00</h2>
          <div className="flex items-center gap-1.5 text-amber-500 text-sm font-semibold mt-2">
            <Clock size={16} />
            Clears in 2-5 days
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
          <button className="flex items-center gap-2 text-sm font-semibold text-[#103B40] hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
            <DownloadCloud size={16} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Fee (10%)</th>
                <th className="px-6 py-4 text-right">Net Earned</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{tx.id}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      tx.type === "Sale" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {tx.type === "Sale" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                  <td className={`px-6 py-4 text-right font-semibold ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-gray-900"}`}>
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-right text-red-500">{tx.fee}</td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.net.startsWith("+") ? "text-gray-900" : "text-red-500"}`}>
                    {tx.net}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <CheckCircle size={14} className="text-emerald-500" />
                      {tx.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
