"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Save,
  ChevronLeft,
  X,
  FileText,
  Trash2,
  Lock,
  Loader2,
  Globe,
  LogOut,
  Shield
} from "lucide-react";

import { authService } from "@/lib/api/services/auth.service";
import { sellersService } from "@/lib/api/services/sellers.service";
import { uploadService } from "@/lib/api/services/upload.service";
import { usersService } from "@/lib/api/services/users.service";
import { useAvatar } from "@/store/useAvatarStore";
import { LogoutModal, DeleteAccountModal } from "@/components/shared/ProfileModals";

type SettingsSection = "basic" | "branding" | "social" | "business" | "password";

export default function SellerEditProfile() {
  const router = useRouter();
  const { setAvatar } = useAvatar();
  const [activeSection, setActiveSection] = useState<SettingsSection>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Store information state
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // Branding state
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);

  // Social Links state
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  // Business/Tax state
  const [businessType, setBusinessType] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  
  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationDocs, setVerificationDocs] = useState<string[]>([]);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [docUploading, setDocUploading] = useState(false);
  const [docProgress, setDocProgress] = useState(0);

  // Alert system
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastError, setToastError] = useState(false);

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      setIsLogoutModalOpen(false);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    const storedUser = authService.getStoredUser() as any;
    const targetId = storedUser?.id || storedUser?._id;
    if (!targetId) return;
    setIsDeleting(true);
    try {
      await usersService.deleteUser(targetId);
      await authService.logout();
      setIsDeleteModalOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Failed to delete account:", error);
      fireToast("Failed to delete account", true);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const fireToast = (msg: string, isErr = false) => {
    setToastMessage(msg);
    setToastError(isErr);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const storedUser = authService.getStoredUser();
        if (!storedUser || storedUser.role !== "seller") {
          router.push("/dashboard/marketplace");
          return;
        }

        const data: any = await usersService.getUserById(storedUser.id || (storedUser as any)._id);
        if (data) {
          setStoreName(data.storeName || "");
          setStoreDescription(data.storeDescription || "");
          setBusinessCategory(data.businessCategory || "");
          setContactEmail(data.email || "");
          setPhoneNumber(data.phone || "");
          setAddress(data.address || "");
          
          setLogoUrl(data.logo || "");
          setBannerUrl(data.banner || "");

          if (data.socialLinks) {
            setFacebook(data.socialLinks.facebook || "");
            setInstagram(data.socialLinks.instagram || "");
            setLinkedin(data.socialLinks.linkedin || "");
            setTwitter(data.socialLinks.twitter || "");
            setWebsite(data.socialLinks.website || data.website || "");
          } else {
            setWebsite(data.website || "");
          }

          setBusinessType(data.businessType || "Individual");
          setTaxNumber(data.taxNumber || "");
          setVerificationDocs(data.verificationDocuments || []);
        }
      } catch (error) {
        console.error("Failed to load seller settings:", error);
        fireToast("Failed to load seller configurations", true);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [router]);

  const handleAssetUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner" | "doc"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "logo") {
      setLogoUploading(true);
      setLogoProgress(0);
      try {
        const response = await uploadService.uploadFile(file, "seller-logos", (prog) => {
          const pct = Math.round((prog.loaded * 100) / prog.total);
          setLogoProgress(pct);
        });
        setLogoUrl(response.url);
        fireToast("Logo uploaded successfully!");
      } catch (err) {
        console.error("Logo upload failed", err);
        fireToast("Failed to upload store logo", true);
      } finally {
        setLogoUploading(false);
      }
    } else if (type === "banner") {
      setBannerUploading(true);
      setBannerProgress(0);
      try {
        const response = await uploadService.uploadFile(file, "seller-banners", (prog) => {
          const pct = Math.round((prog.loaded * 100) / prog.total);
          setBannerProgress(pct);
        });
        setBannerUrl(response.url);
        fireToast("Store banner uploaded successfully!");
      } catch (err) {
        console.error("Banner upload failed", err);
        fireToast("Failed to upload store banner", true);
      } finally {
        setBannerUploading(false);
      }
    } else if (type === "doc") {
      setDocUploading(true);
      setDocProgress(0);
      try {
        const response = await uploadService.uploadFile(file, "seller-documents", (prog) => {
          const pct = Math.round((prog.loaded * 100) / prog.total);
          setDocProgress(pct);
        });
        setVerificationDocs(prev => [...prev, response.url]);
        fireToast("Verification document attached!");
      } catch (err) {
        console.error("Document upload failed", err);
        fireToast("Failed to upload verification document", true);
      } finally {
        setDocUploading(false);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const storedUser = authService.getStoredUser() as any;
      const targetId = storedUser?.id || storedUser?._id;

      if (activeSection === "password") {
        if (!oldPassword || !newPassword || !confirmPassword) {
          fireToast("Please fill all password fields");
          setSaving(false);
          return;
        }
        if (newPassword !== confirmPassword) {
          fireToast("New passwords do not match");
          setSaving(false);
          return;
        }
        await authService.changePassword(targetId, 'seller', { oldPassword, newPassword, confirmPassword });
        fireToast("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setSaving(false);
        return;
      }

      const payload: any = {
        storeName,
        storeDescription,
        businessCategory,
        phone: phoneNumber,
        address,
        logo: logoUrl,
        banner: bannerUrl,
        socialLinks: {
          facebook,
          instagram,
          linkedin,
          twitter,
          website,
        },
        businessType,
        taxNumber,
        verificationDocuments: verificationDocs,
      };

      const response: any = await sellersService.updateSeller(targetId, payload);
      
      // Update local storage user profile data
      const finalLogo = response.seller?.logo || logoUrl;
      const updatedUser = {
        ...storedUser,
        storeName: response.seller?.storeName || storeName,
        storeDescription: response.seller?.storeDescription || storeDescription,
        logo: finalLogo,
        banner: response.seller?.banner || bannerUrl,
        avatar: finalLogo,
        avatarUrl: finalLogo,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Sync across all components in real-time
      if (finalLogo) {
        setAvatar(finalLogo);
      }

      fireToast("Profile settings updated successfully!");
      setTimeout(() => router.push("/dashboard/seller/profile"), 1000);
    } catch (error: any) {
      console.error("Failed to save settings:", error);
      fireToast(error.response?.data?.message || "Failed to update store settings", true);
    } finally {
      setSaving(false);
    }
  };

  const removeDoc = (idxToRemove: number) => {
    setVerificationDocs(prev => prev.filter((_, idx) => idx !== idxToRemove));
    fireToast("Document attachment removed.");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#103B40] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 px-4">
      {/* ─── TOAST NOTIFICATION ─── */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0, x: "-50%" }}
            animate={{ y: 20, opacity: 1, x: "-50%" }}
            exit={{ y: -50, opacity: 0, x: "-50%" }}
            className={`fixed top-4 left-1/2 z-[9999] border shadow-2xl px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 pointer-events-none text-white ${
              toastError 
                ? "bg-red-600 border-red-500" 
                : "bg-teal-600 border-teal-500"
            }`}
          >
            {toastError ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and navigation back */}
      <div className="flex items-center justify-between mb-8 relative">
        <button
          onClick={() => router.push("/dashboard/seller/profile")}
          className="w-10 h-10 bg-[#123E41] text-white rounded-full flex items-center justify-center hover:bg-[#0d2c2e] transition-colors shadow-md active:scale-95"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">Store Configurations</h1>
        <div className="w-10 h-10 opacity-0 pointer-events-none" />
      </div>

      {/* Main Settings Panel layout */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Column Tabs Selector */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: "basic", label: "Basic Information", desc: "Name, category, and bio" },
            { id: "branding", label: "Branding Assets", desc: "Logo and cover banners" },
            { id: "social", label: "Social Connections", desc: "Web and socials links" },
            { id: "business", label: "Verification & Taxes", desc: "Document attachments" },
            { id: "password", label: "Security & Password", desc: "Update store credentials" },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as SettingsSection)}
              className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-[0.99] flex flex-col ${
                activeSection === sec.id
                  ? "bg-[#123E41] border-[#123E41] text-white shadow-md"
                  : "bg-white border-gray-100 hover:border-gray-200 text-gray-700 shadow-sm"
              }`}
            >
              <span className="font-bold text-sm leading-tight">{sec.label}</span>
              <span className={`text-[10px] mt-1 font-medium ${activeSection === sec.id ? "text-teal-200" : "text-gray-400"}`}>
                {sec.desc}
              </span>
            </button>
          ))}

          {/* Account Danger Zone */}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 bg-white hover:bg-gray-50 border border-gray-100 text-gray-600 shadow-sm"
            >
              <LogOut size={16} />
              <span className="font-bold text-sm">Logout</span>
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 shadow-sm"
            >
              <Trash2 size={16} />
              <span className="font-bold text-sm">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Right Column Form Container */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6">
            
            {/* ─── SECTION 1: BASIC INFORMATION ─── */}
            {activeSection === "basic" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 border-b pb-3 border-gray-100 mb-2">
                  <Store className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Store Name</label>
                    <input
                      type="text"
                      required
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="e.g. Design Studio Pro"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Business Category</label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-semibold bg-white"
                    >
                      <option value="">Select a Category</option>
                      <option value="Development">Development</option>
                      <option value="Design">UI/UX Design</option>
                      <option value="Marketing">Digital Marketing</option>
                      <option value="Templates">Templates & Assets</option>
                      <option value="Other">Other Category</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Store description</label>
                  <textarea
                    rows={4}
                    required
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Describe your business, store specialization, and products..."
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 resize-none text-gray-700 leading-relaxed font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Store Contact Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. contact@studio.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium bg-slate-50 text-gray-400 cursor-not-allowed"
                      disabled
                      title="Account email cannot be modified directly"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Store Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +123456789"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Physical Address / Location</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Innovation Way, Tech District"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                  />
                </div>
              </motion.div>
            )}

            {/* ─── SECTION 2: BRANDING ASSETS ─── */}
            {activeSection === "branding" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b pb-3 border-gray-100 mb-2">
                  <UploadCloud className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Branding Assets</h3>
                </div>

                {/* Logo Uploader Dropzone */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 block">Store Logo Asset</span>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-dashed border-gray-200 hover:border-teal-500 transition-colors">
                    {/* logo image preview */}
                    <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Store logo" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={28} className="text-gray-300" />
                      )}
                    </div>
                    {/* logo uploading inputs */}
                    <div className="flex-1 w-full text-center sm:text-left space-y-2.5">
                      <p className="text-xs font-medium text-gray-500">
                        Upload store brand logo in high definition (recommend square 512x512px).
                      </p>
                      <input
                        type="file"
                        ref={logoInputRef}
                        onChange={(e) => handleAssetUpload(e, "logo")}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <button
                          type="button"
                          onClick={() => logoInputRef.current?.click()}
                          disabled={logoUploading}
                          className="bg-teal-50 text-[#123E41] hover:bg-teal-100 border border-teal-100 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                          {logoUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                          Choose File
                        </button>
                        {logoUrl && (
                          <button
                            type="button"
                            onClick={() => setLogoUrl("")}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-colors flex items-center justify-center w-8 h-8"
                            title="Remove Logo"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      
                      {/* Logo Progress bar */}
                      {logoUploading && (
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-teal-600 font-bold">
                            <span>Uploading logo...</span>
                            <span>{logoProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full transition-all" style={{ width: `${logoProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Banner Uploader Dropzone */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 block">Store Cover Banner Asset</span>
                  <div className="flex flex-col gap-4 p-5 rounded-2xl border border-dashed border-gray-200 hover:border-teal-500 transition-colors">
                    {/* banner cover preview */}
                    <div className="h-32 w-full rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center relative shadow-inner">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt="Store banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-300">
                           <UploadCloud size={32} />
                          <span className="text-[10px] font-bold uppercase tracking-wider">No Cover Image</span>
                        </div>
                      )}
                    </div>
                    {/* banner uploading inputs */}
                    <div className="space-y-2.5">
                      <p className="text-xs font-medium text-gray-500">
                        Upload custom wide store cover banner (minimum aspect ratio 16:9, e.g. 1920x1080px).
                      </p>
                      <input
                        type="file"
                        ref={bannerInputRef}
                        onChange={(e) => handleAssetUpload(e, "banner")}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => bannerInputRef.current?.click()}
                          disabled={bannerUploading}
                          className="bg-teal-50 text-[#123E41] hover:bg-teal-100 border border-teal-100 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
                        >
                          {bannerUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={12} />}
                          Choose File
                        </button>
                        {bannerUrl && (
                          <button
                            type="button"
                            onClick={() => setBannerUrl("")}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-xl border border-transparent hover:border-red-100 transition-colors flex items-center justify-center w-8 h-8"
                            title="Remove Banner"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      {/* Banner Progress bar */}
                      {bannerUploading && (
                        <div className="w-full max-w-xs space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-teal-600 font-bold">
                            <span>Uploading banner...</span>
                            <span>{bannerProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-teal-600 h-full transition-all" style={{ width: `${bannerProgress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── SECTION 3: SOCIAL CONNECTIONS ─── */}
            {activeSection === "social" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 border-b pb-3 border-gray-100 mb-2">
                  <Globe className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Social Connections</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500">Website URL</label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourstore.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Facebook profile</label>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="facebook.com/username"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Instagram profile</label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="instagram.com/username"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">LinkedIn profile</label>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Twitter / X profile</label>
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="twitter.com/username"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── SECTION 4: VERIFICATION & TAXES ─── */}
            {activeSection === "business" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 border-b pb-3 border-gray-100 mb-2">
                  <Lock className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Verification & Taxes</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Business Registry Type</label>
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-semibold bg-white"
                    >
                      <option value="Individual">Individual Creator</option>
                      <option value="SoleProprietor">Sole Proprietor</option>
                      <option value="LLC">Limited Liability Company (LLC)</option>
                      <option value="Corporation">Corporation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Tax ID Number (Optional)</label>
                    <input
                      type="text"
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(e.target.value)}
                      placeholder="e.g. TX-999-88-77"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-800 font-medium"
                    />
                  </div>
                </div>

                {/* Verification Documents drag & drop zone */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">Attach Verification Documents</span>
                    <span className="text-[10px] font-bold text-teal-600 flex items-center gap-1">
                      <Lock size={10} /> Secure File Storage
                    </span>
                  </div>

                  {/* Documents list */}
                  {verificationDocs.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {verificationDocs.map((url, index) => {
                        const filename = url.split("/").pop() || `doc_${index + 1}.pdf`;
                        return (
                          <div key={index} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-xl text-xs font-semibold text-gray-700">
                            <div className="flex items-center gap-2 truncate">
                              <FileText size={16} className="text-teal-600 shrink-0" />
                              <a href={url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-teal-700 hover:underline">
                                {filename.slice(0, 30)}...
                              </a>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDoc(index)}
                              className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Upload trigger dropzone */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-teal-500 transition-colors">
                    <input
                      type="file"
                      ref={docInputRef}
                      onChange={(e) => handleAssetUpload(e, "doc")}
                      className="hidden"
                      accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                    />
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      disabled={docUploading}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-200/70 py-3 px-5 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 active:scale-95"
                    >
                      {docUploading ? <Loader2 size={12} className="animate-spin" /> : <UploadCloud size={14} />}
                      Attach Document
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2 font-medium text-center">
                      Upload PDF, DOCX, or PNG scans of business registers, licenses, or passports (Max 10MB).
                    </p>

                    {/* Progress Bar loader */}
                    {docUploading && (
                      <div className="w-full max-w-xs mt-4 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-teal-600 font-bold">
                          <span>Uploading document...</span>
                          <span>{docProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-600 h-full transition-all" style={{ width: `${docProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 🔥 SECTION 5: PASSWORD 🔥 */}
            {activeSection === "password" && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-5"
              >
                <div className="flex items-center gap-3 border-b pb-3 border-gray-100 mb-2">
                  <Shield className="text-teal-600 w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-900">Security & Password</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123E41]/30 focus:border-[#123E41] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123E41]/30 focus:border-[#123E41] transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#123E41]/30 focus:border-[#123E41] transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── ACTION BUTTONS AREA ─── */}
            <div className="flex items-center justify-between border-t pt-6 border-gray-100 mt-8">
              <button
                type="button"
                onClick={() => router.push("/dashboard/seller/profile")}
                disabled={saving}
                className="px-5 py-3 rounded-xl border border-gray-200 hover:bg-slate-50 transition-colors text-slate-600 text-xs font-bold active:scale-95"
              >
                Cancel Changes
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#123E41] hover:bg-[#0d2c2e] text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <Save size={14} />
                    Save Configurations
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* ─── MODALS ─── */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        isLoggingOut={isLoggingOut}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
