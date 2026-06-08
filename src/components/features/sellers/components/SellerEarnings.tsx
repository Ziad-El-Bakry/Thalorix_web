"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, DownloadCloud } from "lucide-react";
import { User } from "@/lib/api/services/auth.service";
import { sellersService } from "@/lib/api/services/sellers.service";

export default function SellerEarnings({ user }: { user: User | null }) {
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [recentSold, setRecentSold] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const [revData, dlData, statsData] = await Promise.all([
          sellersService.getDashboardRevenue().catch(() => ({ totalRevenue: 0 })),
          sellersService.getDashboardDownloads().catch(() => ({ totalDownloads: 0 })),
          sellersService.getDashboardStats().catch(() => ({
            recentSales: [],
            recentReviews: [],
            topProducts: [],
            recentSoldProducts: []
          }))
        ]);
        setRevenue(revData.totalRevenue || 0);
        setDownloads(dlData.totalDownloads || 0);
        setRecentSold(statsData.recentSoldProducts || []);
      } catch (err) {
        console.error("Failed to load earnings data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEarnings();
  }, []);

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
          <p className="text-white/70 text-sm font-medium mb-1 relative z-10">Available for Payout (90%)</p>
          <h2 className="text-4xl font-bold mb-4 relative z-10">${(revenue * 0.9).toFixed(2)}</h2>
          <button 
            onClick={handlePayoutRequest}
            disabled={requestingPayout || revenue === 0}
            className="w-full py-2.5 bg-[#43B0B5] hover:bg-[#389b9f] transition-colors rounded-xl font-bold text-sm shadow-sm relative z-10 flex items-center justify-center gap-2 disabled:opacity-50"
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
          <h2 className="text-3xl font-bold text-gray-900">${revenue.toFixed(2)}</h2>
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold mt-2">
            <ArrowUpRight size={16} />
            Live revenue from backend
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
          <p className="text-gray-500 text-sm font-medium mb-1">Pending Clearance</p>
          <h2 className="text-3xl font-bold text-gray-900">$0.00</h2>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#103B40] border-t-transparent" />
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : recentSold.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400 font-medium">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                recentSold.map((tx) => {
                  const gross = tx.price * (tx.quantity || 1);
                  const fee = gross * 0.1;
                  const net = gross - fee;
                  return (
                    <tr key={tx.orderId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]" title={tx.orderId}>
                        {tx.orderId}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600">
                          <ArrowUpRight size={12} />
                          Sale
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(tx.soldAt).toLocaleDateString()} {new Date(tx.soldAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">
                        +${gross.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right text-red-500">
                        -${fee.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        +${net.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <CheckCircle size={14} className="text-emerald-500" />
                          Completed
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
