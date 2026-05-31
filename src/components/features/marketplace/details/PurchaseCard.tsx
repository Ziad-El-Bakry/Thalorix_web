"use client";

import Link from "next/link";
import { Eye, ShoppingCart, Check, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Template } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { usePurchaseStore } from "@/store/usePurchaseStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PurchaseCardProps {
  template: Template;
}

export default function PurchaseCard({ template }: PurchaseCardProps) {
  const isFree = template.price <= 0;
  const { addToCart, items } = useCartStore();
  const { hasPurchased, addPurchases } = usePurchaseStore();
  const router = useRouter();

  const templateId = (template.id || template._id) as string;
  const isPurchased = hasPurchased(templateId);
  const inCart = items.some(item => (item.id || item._id) === templateId);

  const handleGetFree = () => {
    addPurchases([template]);
    if (template.fileUrl) {
      window.open(template.fileUrl, '_blank');
    }
  };

  // Derived metadata
  const getFileFormat = () => {
    if (!template.fileUrl) return "ZIP";
    const parts = template.fileUrl.split('.');
    const ext = parts.pop();
    if (ext && ext.length <= 4 && parts.length > 0) {
      return ext.toUpperCase();
    }
    return "ZIP";
  };
  const fileFormat = getFileFormat();
  const licenseType = isFree ? "Free Use" : "Commercial";
  
  // Fetch file size dynamically from Cloudinary URL if possible
  const [fileSize, setFileSize] = useState<string>("Unknown");

  useEffect(() => {
    if (template.fileUrl) {
      fetch(template.fileUrl, { method: 'HEAD' })
        .then(res => {
          const bytes = res.headers.get('content-length');
          if (bytes && parseInt(bytes) > 0) {
            const mb = (parseInt(bytes) / (1024 * 1024)).toFixed(1);
            setFileSize(`${mb} MB`);
          } else {
            setFileSize("Unknown");
          }
        })
        .catch(() => setFileSize("Unknown"));
    }
  }, [template.fileUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-6 border border-teal-50">
        <div className="flex items-end gap-3 justify-center mb-6">
           <span className="text-3xl font-bold text-gray-900">{isFree ? "Free" : `$${template.price.toFixed(2)}`}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">File Format</p>
            <p className="text-sm font-semibold text-[#103B40]">{fileFormat}</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">File Size</p>
            <p className="text-sm font-semibold text-[#103B40]">{fileSize}</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">Dimensions</p>
            <p className="text-sm font-semibold text-[#103B40]">Responsive</p>
          </div>
          <div className="bg-teal-50/50 rounded-xl p-3 border border-teal-50">
            <p className="text-xs text-gray-500 mb-1">License</p>
            <p className="text-sm font-semibold text-[#103B40]">{licenseType}</p>
          </div>
        </div>

        <div className="space-y-3">
          {isPurchased ? (
            <a href={template.fileUrl || "#"} download target="_blank" rel="noopener noreferrer" className="block w-full">
              <button className="w-full bg-[#123E41] text-white py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium flex justify-center items-center gap-2">
                <Download size={18} />
                Download Template
              </button>
            </a>
          ) : isFree ? (
            <button 
              onClick={handleGetFree}
              disabled={!template.fileUrl}
              className={`w-full py-3.5 rounded-xl transition-colors font-medium flex justify-center items-center gap-2 ${
                template.fileUrl ? "bg-[#123E41] text-white hover:bg-[#0d2c2e]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Download size={18} />
              Get for Free
            </button>
          ) : inCart ? (
            <Link href="/dashboard/marketplace/cart" className="block w-full">
              <button className="w-full bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 transition-colors font-medium flex justify-center items-center gap-2">
                <Check size={18} />
                Go to Cart
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => addToCart(template)}
              disabled={!template.fileUrl}
              className={`w-full py-3.5 rounded-xl transition-colors font-medium flex justify-center items-center gap-2 ${
                template.fileUrl ? "bg-[#123E41] text-white hover:bg-[#0d2c2e]" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={18} />
              Add to Cart - ${template.price.toFixed(2)}
            </button>
          )}
          <button className="w-full bg-[#A5C9D3]/30 text-[#123E41] py-3.5 rounded-xl hover:bg-[#A5C9D3]/50 transition-colors font-medium flex items-center justify-center gap-2">
            <Eye size={18} />
            Preview
          </button>
        </div>
      </div>
    </motion.div>
  );
}
