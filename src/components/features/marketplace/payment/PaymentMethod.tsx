"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, CreditCard, User, Calendar, Lock, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CardDetail {
  id: string;
  type: "visa" | "mastercard" | "custom";
  last4: string;
  expiry: string;
  cardholderName: string;
}

interface PaymentMethodProps {
  methods: CardDetail[];
  selectedMethodId: string;
  onSelectMethod: (id: string) => void;
  onAddCard: (card: Omit<CardDetail, "id">) => void;
  onDeleteCard: (id: string) => void;
}

export default function PaymentMethod({
  methods,
  selectedMethodId,
  onSelectMethod,
  onAddCard,
  onDeleteCard,
}: PaymentMethodProps) {
  const [showAddForm, setShowAddForm] = useState(methods.length === 0);

  // Automatically show form if no methods exist
  useEffect(() => {
    if (methods.length === 0) {
      setShowAddForm(true);
    }
  }, [methods.length]);
  
  // New card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Refs for keyboard navigation
  const radioGroupRef = useRef<HTMLDivElement>(null);

  // Validate form fields live
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Card Number: digits only, must be 16 digits
    const numericCardNumber = cardNumber.replace(/\s/g, "");
    if (touched.cardNumber) {
      if (!numericCardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^\d+$/.test(numericCardNumber)) {
        newErrors.cardNumber = "Card number must contain digits only";
      } else if (numericCardNumber.length !== 16) {
        newErrors.cardNumber = "Card number must be exactly 16 digits";
      }
    }

    // Cardholder Name: alphabetic and spaces, at least 3 chars
    if (touched.cardholderName) {
      if (!cardholderName.trim()) {
        newErrors.cardholderName = "Cardholder name is required";
      } else if (!/^[a-zA-Z\s]{3,}$/.test(cardholderName)) {
        newErrors.cardholderName = "Must be at least 3 letters (alphabetic only)";
      }
    }

    // Expiration Date: MM/YY format, must be valid
    if (touched.expiryDate) {
      if (!expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        newErrors.expiryDate = "Must be in MM/YY format";
      } else {
        const [monthStr, yearStr] = expiryDate.split("/");
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        const now = new Date();
        const currentYearShort = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          newErrors.expiryDate = "Invalid month (01-12)";
        } else if (year < currentYearShort || (year === currentYearShort && month < currentMonth)) {
          newErrors.expiryDate = "Card has expired";
        } else if (year > currentYearShort + 20) {
          newErrors.expiryDate = "Invalid expiration year";
        }
      }
    }

    // CVV: 3 or 4 digits
    if (touched.cvv) {
      if (!cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^\d{3,4}$/.test(cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    setErrors(newErrors);
  }, [cardNumber, cardholderName, expiryDate, cvv, touched]);

  // Handle Input formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    // Format as XXXX XXXX XXXX XXXX
    const formatted = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvv(value);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Determine card type dynamically
  const getCardType = (num: string): "visa" | "mastercard" | "custom" => {
    const cleanNum = num.replace(/\s/g, "");
    if (cleanNum.startsWith("4")) return "visa";
    if (cleanNum.startsWith("5")) return "mastercard";
    return "custom";
  };

  // Form submission check
  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    cardholderName.trim().length >= 3 &&
    /^\d{2}\/\d{2}$/.test(expiryDate) &&
    /^\d{3,4}$/.test(cvv) &&
    Object.keys(errors).length === 0;

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const type = getCardType(cardNumber);
    const last4 = cardNumber.replace(/\s/g, "").slice(-4);

    onAddCard({
      type,
      last4,
      expiry: expiryDate,
      cardholderName,
    });

    // Reset Form
    setCardNumber("");
    setCardholderName("");
    setExpiryDate("");
    setCvv("");
    setErrors({});
    setTouched({});
    setShowAddForm(false);
  };

  // Keyboard navigation inside payment methods
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = (index + 1) % methods.length;
      onSelectMethod(methods[nextIndex].id);
      focusCard(nextIndex);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = (index - 1 + methods.length) % methods.length;
      onSelectMethod(methods[prevIndex].id);
      focusCard(prevIndex);
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onSelectMethod(methods[index].id);
    }
  };

  const focusCard = (index: number) => {
    if (radioGroupRef.current) {
      const cards = radioGroupRef.current.querySelectorAll('[role="radio"]');
      if (cards[index]) {
        (cards[index] as HTMLElement).focus();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-150 mb-6 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-[#103B40] text-lg">Payment Method</h2>
        <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
          <Lock size={12} /> Secure Checkout
        </span>
      </div>

      <div 
        ref={radioGroupRef} 
        role="radiogroup" 
        aria-label="Payment Method Selectors" 
        className="space-y-3"
      >
        {methods.map((method, index) => {
          const isSelected = selectedMethodId === method.id;
          return (
            <div
              key={method.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => onSelectMethod(method.id)}
              className={`flex items-center justify-between border-2 rounded-xl p-4 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:bg-slate-50/50 ${
                isSelected
                  ? "border-[#123E41] bg-teal-50/20 shadow-sm"
                  : "border-gray-200"
              }`}
            >
              <div className="flex gap-4 items-center flex-1">
                {/* Radio Circle Indicator */}
                <div 
                  className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isSelected 
                      ? "border-[#103B40]" 
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#103B40]" />
                  )}
                </div>

                {/* Card Type Brand Logo */}
                <div className="flex items-center gap-3">
                  {method.type === "visa" ? (
                    <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-[#1a1f71] text-sm italic tracking-wide select-none">
                      VISA
                    </div>
                  ) : method.type === "mastercard" ? (
                    <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center">
                      <div className="flex items-center relative w-6 h-4 select-none">
                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-90 absolute left-0" />
                        <div className="w-3 h-3 rounded-full bg-amber-400 opacity-90 absolute left-2" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-6 bg-slate-100 rounded flex items-center justify-center text-gray-500">
                      <CreditCard size={14} />
                    </div>
                  )}

                  {/* Card Metadata */}
                  <div>
                    <p className="font-semibold text-sm text-gray-900 leading-none mb-1">
                      •••• •••• •••• {method.last4}
                    </p>
                    <div className="flex gap-2 items-center text-[10px] text-gray-500 font-medium">
                      <span>Expires {method.expiry}</span>
                      <span>•</span>
                      <span className="uppercase truncate max-w-[120px]">
                        {method.cardholderName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: Delete custom added card */}
              {method.id !== "visa" && method.id !== "mastercard" && (
                <button
                  type="button"
                  aria-label="Remove saved card"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCard(method.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}

        {/* Expandable Add Card Toggle Button */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-3 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 hover:border-gray-400"
          >
            <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400">
              <Plus size={14} />
            </div>
            <span className="font-bold text-sm text-[#103B40]">Add New Card</span>
          </button>
        )}

        {/* Dynamic Add New Card Form Expansion */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <form
                onSubmit={handleSubmitCard}
                className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-4 space-y-4"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-sm text-[#103B40] flex items-center gap-1.5">
                    <CreditCard size={15} /> Card Information
                  </h3>
                  {methods.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setErrors({});
                        setTouched({});
                      }}
                      className="text-xs text-gray-500 hover:text-[#103B40] font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                {/* Cardholder Name Input */}
                <div>
                  <label htmlFor="cardholderName" className="block text-xs font-semibold text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={14} />
                    </span>
                    <input
                      id="cardholderName"
                      type="text"
                      placeholder="e.g. John Doe"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      onBlur={() => handleBlur("cardholderName")}
                      className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                        errors.cardholderName && touched.cardholderName
                          ? "border-red-400 focus:ring-red-200"
                          : "border-gray-200 focus:border-teal-500"
                      }`}
                    />
                  </div>
                  {errors.cardholderName && touched.cardholderName && (
                    <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.cardholderName}
                    </p>
                  )}
                </div>

                {/* Card Number Input */}
                <div>
                  <label htmlFor="cardNumber" className="block text-xs font-semibold text-gray-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <CreditCard size={14} />
                    </span>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      onBlur={() => handleBlur("cardNumber")}
                      className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                        errors.cardNumber && touched.cardNumber
                          ? "border-red-400 focus:ring-red-200"
                          : "border-gray-200 focus:border-teal-500"
                      }`}
                    />
                  </div>
                  {errors.cardNumber && touched.cardNumber && (
                    <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle size={10} /> {errors.cardNumber}
                    </p>
                  )}
                </div>

                {/* Expiry & CVV Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div>
                    <label htmlFor="expiryDate" className="block text-xs font-semibold text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Calendar size={14} />
                      </span>
                      <input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryChange}
                        onBlur={() => handleBlur("expiryDate")}
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                          errors.expiryDate && touched.expiryDate
                            ? "border-red-400 focus:ring-red-200"
                            : "border-gray-200 focus:border-teal-500"
                        }`}
                      />
                    </div>
                    {errors.expiryDate && touched.expiryDate && (
                      <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label htmlFor="cvv" className="block text-xs font-semibold text-gray-700 mb-1">
                      CVV
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={14} />
                      </span>
                      <input
                        id="cvv"
                        type="password"
                        placeholder="•••"
                        value={cvv}
                        onChange={handleCvvChange}
                        onBlur={() => handleBlur("cvv")}
                        className={`w-full bg-white border rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500/50 ${
                          errors.cvv && touched.cvv
                            ? "border-red-400 focus:ring-red-200"
                            : "border-gray-200 focus:border-teal-500"
                        }`}
                      />
                    </div>
                    {errors.cvv && touched.cvv && (
                      <p className="text-[10px] text-red-500 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-1.5 shadow-sm ${
                    isFormValid
                      ? "bg-[#123E41] text-white hover:bg-[#0d2c2e]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={15} /> Save & Select Card
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
