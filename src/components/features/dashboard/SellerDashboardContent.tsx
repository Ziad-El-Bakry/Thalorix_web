"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  DollarSign,
  Package,
  Download,
  Star,
  TrendingUp,
  ShoppingBag,
  Upload,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { templatesService } from "@/lib/api/services/templates.service";
import { authService, User } from "@/lib/api/services/auth.service";
import { sellersService } from "@/lib/api/services/sellers.service";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface SellerStat {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function SellerStatCard({ stat }: { stat: SellerStat }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: stat.bg }}
        >
          {stat.icon}
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-lg ${
            stat.trendUp
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-500 bg-red-50"
          }`}
        >
          {stat.trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
        <p className="text-xs text-gray-500 mt-0.5 font-medium">{stat.label}</p>
      </div>
    </div>
  );
}

// Mock sales data
const MOCK_RECENT_SALES = [
  {
    id: "1",
    buyer: "Alex Johnson",
    template: "Dashboard UI Kit",
    amount: "$29",
    time: "2h ago",
    avatar: "AJ",
    color: "#6366f1",
  },
  {
    id: "2",
    buyer: "Sarah Chen",
    template: "E-Commerce Pack",
    amount: "$19",
    time: "5h ago",
    avatar: "SC",
    color: "#0891b2",
  },
  {
    id: "3",
    buyer: "Mike Brown",
    template: "Portfolio Template",
    amount: "$15",
    time: "8h ago",
    avatar: "MB",
    color: "#d946ef",
  },
  {
    id: "4",
    buyer: "Emily Davis",
    template: "Blog Starter",
    amount: "$9",
    time: "12h ago",
    avatar: "ED",
    color: "#ea580c",
  },
  {
    id: "5",
    buyer: "James Wilson",
    template: "Dashboard UI Kit",
    amount: "$29",
    time: "1d ago",
    avatar: "JW",
    color: "#16a34a",
  },
];

const MOCK_RECENT_REVIEWS = [
  {
    id: "1",
    reviewer: "Maria Lopez",
    rating: 5,
    comment: "Amazing quality! The components are well-structured.",
    template: "Dashboard UI Kit",
    time: "3h ago",
  },
  {
    id: "2",
    reviewer: "Tom Anderson",
    rating: 4,
    comment: "Great template, easy to customize.",
    template: "E-Commerce Pack",
    time: "1d ago",
  },
  {
    id: "3",
    reviewer: "Lisa Wang",
    rating: 5,
    comment: "Best purchase I've made. Highly recommend!",
    template: "Portfolio Template",
    time: "2d ago",
  },
];

// Mock revenue data will be generated dynamically based on selected range

export default function SellerDashboardContent({
  user,
}: {
  user: User | null;
}) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueRange, setRevenueRange] = useState<"week" | "month" | "year">(
    "week",
  );
  const [revenue, setRevenue] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = user?.id || (user as any)?._id;
        if (userId) {
          const [templatesData, revenueData, downloadsData, statsData] =
            await Promise.all([
              sellersService.getSellerTemplates(userId).catch(() => []),
              sellersService
                .getDashboardRevenue()
                .catch(() => ({ totalRevenue: 0 })),
              sellersService
                .getDashboardDownloads()
                .catch(() => ({ totalDownloads: 0 })),
              sellersService.getDashboardStats().catch(() => ({
                recentSales: [],
                recentReviews: [],
                topProducts: [],
                recentSoldProducts: [],
              })),
            ]);
          setTemplates(templatesData || []);
          setRevenue(revenueData.totalRevenue || 0);
          setDownloads(downloadsData.totalDownloads || 0);
          setRecentSales(statsData.recentSales || []);
          setRecentReviews(statsData.recentReviews || []);
          setTopProducts(statsData.topProducts || []);
        }
      } catch (err) {
        console.error("Failed to load seller data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const stats: SellerStat[] = [
    {
      label: "Total Revenue",
      value: `$${revenue.toLocaleString()}`,
      trend: "+18%",
      trendUp: true,
      icon: <DollarSign size={20} className="text-emerald-600" />,
      color: "#10B981",
      bg: "#ecfdf5",
    },
    {
      label: "Total Downloads",
      value: String(downloads),
      trend: "+24%",
      trendUp: true,
      icon: <Download size={20} className="text-violet-600" />,
      color: "#8B5CF6",
      bg: "#f5f3ff",
    },
    {
      label: "Average Rating",
      value: String(user?.ratings || "5.0"),
      trend: "+0.0",
      trendUp: true,
      icon: <Star size={20} className="text-amber-500" />,
      color: "#F59E0B",
      bg: "#fffbeb",
    },
  ];

  const getRevenueData = () => {
    switch (revenueRange) {
      case "year":
        return {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          values: [
            400, 300, 500, 450, 600, 700, 650, 800, 950, 1100, 1050, 1200,
          ],
        };
      case "month":
        return {
          labels: ["W1", "W2", "W3", "W4"],
          values: [450, 520, 480, 610],
        };
      case "week":
      default:
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [120, 95, 180, 145, 210, 175, 250],
        };
    }
  };

  const chartData = getRevenueData();
  const maxRev = Math.max(...chartData.values);

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Actions Bar */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <Link href="/dashboard/marketplace/upload">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-[#103B40] hover:bg-[#0d2c2e] text-white px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm"
          >
            <Upload size={16} /> Upload Template
          </motion.button>
        </Link>
        <Link href="/dashboard/seller/products">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#103B40] px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm border border-gray-200"
          >
            <Package size={16} /> My Products
          </motion.button>
        </Link>
        <Link href="/dashboard/seller/earnings">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#103B40] px-5 py-3 rounded-xl transition-colors font-medium text-sm shadow-sm border border-gray-200"
          >
            <DollarSign size={16} /> View Earnings
          </motion.button>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5"
      >
        {stats.map((stat) => (
          <SellerStatCard key={stat.label} stat={stat} />
        ))}
      </motion.div>

      {/* Revenue Chart + Recent Sales */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Revenue Overview
              </h3>
              <div className="flex items-center gap-1 mt-2 bg-gray-50/80 p-1 rounded-lg w-fit border border-gray-100">
                {(["week", "month", "year"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setRevenueRange(range)}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md capitalize transition-all ${
                      revenueRange === range
                        ? "bg-white text-[#103B40] shadow-sm border border-gray-200/60"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {range === "week"
                      ? "This Week"
                      : range === "month"
                        ? "This Month"
                        : "This Year"}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 self-start sm:self-auto">
              <TrendingUp size={16} />
              {revenueRange === "week"
                ? "+18%"
                : revenueRange === "month"
                  ? "+24%"
                  : "+42%"}
            </div>
          </div>
          <div className="flex items-end gap-2 sm:gap-3 h-[200px]">
            {chartData.labels.map((label, i) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center gap-2 group"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(chartData.values[i] / maxRev) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-lg min-h-[8px] relative transition-all duration-300 group-hover:opacity-80"
                  style={{
                    background:
                      i === chartData.labels.length - 1
                        ? "linear-gradient(180deg, #43B0B5 0%, #103B40 100%)"
                        : "linear-gradient(180deg, #e5e7eb 0%, #d1d5db 100%)",
                  }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    ${chartData.values[i]}
                  </div>
                </motion.div>
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Recent Sales</h3>
            <ShoppingBag size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentSales.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-medium">
                No sales recorded yet.
              </div>
            ) : (
              recentSales.slice(0, 4).map((sale) => (
                <div key={sale.orderId} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 bg-teal-600">
                    {sale.name?.substring(0, 2).toUpperCase() || "BY"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium truncate">
                      {sale.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {sale.email}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600">
                      ${sale.totalAmount}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(sale.latestPurchaseAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <Link href="/dashboard/seller/earnings" className="block mt-4">
            <div className="text-xs text-[#103B40] font-semibold flex items-center gap-1 hover:underline">
              View all transactions <ArrowUpRight size={12} />
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Reviews + Top Products */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Recent Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">
              Recent Reviews
            </h3>
            <Star size={16} className="text-amber-400" />
          </div>
          <div className="space-y-4">
            {recentReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-medium">
                No reviews received yet.
              </div>
            ) : (
              recentReviews.map((review) => (
                <div
                  key={review._id || review.id}
                  className="border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {review.userId?.name ||
                        review.userId?.username ||
                        "Anonymous User"}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          size={12}
                          className={
                            j < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {review.comment}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-gray-900">Top Products</h3>
            <Link
              href="/dashboard/seller/products"
              className="text-xs text-[#103B40] font-semibold hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-medium">
                No sales recorded for any product yet.
              </div>
            ) : (
              topProducts.map((product) => (
                <div
                  key={product.templateId}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-teal-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {product.totalSoldQuantity} sales
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      ${product.totalRevenue}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
