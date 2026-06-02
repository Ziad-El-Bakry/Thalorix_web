"use client";

import UserHeader from "@/components/ui/UserHeader";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { usePurchaseStore } from "@/store/usePurchaseStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

const isValidImage = (src?: string) => {
  if (!src) return false;
  if (src.startsWith("/mnt/")) return false;
  return true;
};

export default function CartPage() {
  const { items, removeFromCart, clearCart, getTotal } = useCartStore();
  const { addPurchases } = usePurchaseStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Filter free and paid items
    const freeItems = items.filter(item => item.price <= 0);
    const paidItems = items.filter(item => item.price > 0);

    if (freeItems.length > 0) {
      addPurchases(freeItems);
    }

    if (paidItems.length > 0) {
      alert("Free templates have been added to your library! Redirecting to secure checkout for your paid templates.");
      
      // Remove only free items from the cart, keeping paid items
      items.forEach(item => {
        if (item.price <= 0) {
          removeFromCart(item.id || item._id as string);
        }
      });

      // Redirect to the first paid item's payment page
      const firstPaid = paidItems[0];
      router.push(`/dashboard/marketplace/${firstPaid.id || firstPaid._id}/payment`);
    } else {
      // If all items are free, complete checkout normally
      clearCart();
      router.push("/dashboard/marketplace/history");
    }
  };

  return (
    <div className="-m-4 md:-m-6 lg:-m-10 p-4 md:p-6 lg:p-10 bg-[#E2E3EA] min-h-[calc(100vh-60px)]">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col h-full">
        <div className="border-b-2 border-[#b0c4c4] pb-2 mb-4 relative z-50">
          <UserHeader compact={true} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center mb-6 relative justify-center"
        >
          <Link
            href="/dashboard/marketplace"
            className="absolute left-0 w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-[#103B40] flex items-center gap-2">
            <ShoppingCart size={24} />
            Your Cart
          </h1>
        </motion.div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[20px] shadow-sm border border-teal-50">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={32} className="text-[#123E41]" />
            </div>
            <h2 className="text-xl font-bold text-[#103B40] mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Looks like you haven't added any templates to your cart yet. Explore the marketplace to find what you need.
            </p>
            <Link href="/dashboard/marketplace">
              <button className="bg-[#123E41] text-white px-6 py-3 rounded-xl hover:bg-[#0d2c2e] transition-colors font-medium">
                Browse Marketplace
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const imagePath = item.image || item.imageUrl;
                const hasValidImage = isValidImage(imagePath);

                return (
                  <div key={item.id || item._id} className="bg-white rounded-[20px] p-4 shadow-sm border border-teal-50 flex gap-4 items-center">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {hasValidImage ? (
                        <Image src={imagePath as string} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#E2E3EA] text-xs">No Cover</div>
                      )}
                    </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#103B40] text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">{item.description}</p>
                    <p className="font-bold text-[#103B40]">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id || item._id as string)}
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Remove item from cart"
                    aria-label="Remove item from cart"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[20px] p-6 shadow-sm border border-teal-50 sticky top-6">
                <h3 className="text-xl font-bold text-[#103B40] mb-4">Order Summary</h3>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-500">Items ({items.length})</span>
                  <span className="font-semibold text-gray-800">${getTotal().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 my-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-[#103B40] text-lg">Total</span>
                  <span className="font-bold text-[#103B40] text-2xl">${getTotal().toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#123E41] text-white py-4 rounded-xl hover:bg-[#0d2c2e] transition-colors font-bold text-lg shadow-md mt-4"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
