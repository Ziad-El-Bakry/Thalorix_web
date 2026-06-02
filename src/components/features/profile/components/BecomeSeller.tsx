"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ArrowRight, CheckCircle, UploadCloud, DollarSign, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/api/services/auth.service";

export default function BecomeSeller() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: "",
    storeDescription: "",
    category: "",
  });

  const handleNext = () => setStep((s) => s + 1);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Mock the backend upgrade
    setTimeout(() => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        user.role = "seller";
        user.storeName = formData.storeName;
        user.storeDescription = formData.storeDescription;
        localStorage.setItem("user", JSON.stringify(user));
        // Force refresh to update layout
        window.location.href = "/dashboard/seller/dashboard";
      }
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-[#103B40]/5 overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-[#103B40] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#43B0B5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#43B0B5] rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
          
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/20">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3 relative z-10">Become a Thalorix Seller</h1>
          <p className="text-white/70 max-w-md mx-auto relative z-10">
            Join our community of creators. Sell your templates, UI kits, and digital assets to thousands of developers worldwide.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid gap-6">
                  {[
                    { icon: <UploadCloud size={24} />, title: "Upload your work", desc: "Easily upload templates, UI kits, code snippets, and assets." },
                    { icon: <Globe size={24} />, title: "Reach a global audience", desc: "Get your products in front of thousands of active developers." },
                    { icon: <DollarSign size={24} />, title: "Earn money", desc: "Keep 90% of your revenue. Fast payouts and clear analytics." },
                  ].map((feature, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#103B40]/5 text-[#103B40] flex items-center justify-center flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{feature.title}</h3>
                        <p className="text-gray-500 text-sm mt-1">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-[#103B40] text-white rounded-xl font-bold text-lg hover:bg-[#0d2c2e] transition-colors flex items-center justify-center gap-2"
                >
                  Start Setting Up <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Store Details</h2>
                  <p className="text-gray-500 text-sm mt-1">Tell us a bit about what you plan to sell.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Name</label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                      placeholder="e.g. Acme Designs"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Primary Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      title="Primary Category"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all appearance-none"
                    >
                      <option value="">Select a category</option>
                      <option value="ui-kits">UI Kits & Templates</option>
                      <option value="plugins">Plugins & Scripts</option>
                      <option value="themes">CMS Themes</option>
                      <option value="assets">Graphic Assets</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Store Description</label>
                    <textarea
                      value={formData.storeDescription}
                      onChange={(e) => setFormData({ ...formData, storeDescription: e.target.value })}
                      placeholder="What makes your products unique?"
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#43B0B5]/30 focus:border-[#43B0B5] transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!formData.storeName || !formData.category}
                    className="flex-1 py-4 bg-[#103B40] text-white rounded-xl font-bold hover:bg-[#0d2c2e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Review Details <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center space-y-8 py-4"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={40} className="text-emerald-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Launch!</h2>
                  <p className="text-gray-500">
                    Your store <strong className="text-gray-900">{formData.storeName}</strong> is ready to be created.
                    By continuing, you agree to our Seller Terms of Service.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                    className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 py-4 bg-[#103B40] text-white rounded-xl font-bold hover:bg-[#0d2c2e] transition-colors disabled:opacity-80 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Upgrading Account...
                      </>
                    ) : (
                      "Create My Store"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
