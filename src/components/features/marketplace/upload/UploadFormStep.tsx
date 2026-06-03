"use client";

import { CloudUpload, Info, Gift, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { categoriesService } from "@/lib/api/services/categories.service";
import { Category } from "@/types";

export interface TemplateFormData {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  file: File;
  image?: File;
  tags: string;
}

interface UploadFormStepProps {
  onNext: (data: TemplateFormData) => void;
}

export default function UploadFormStep({ onNext }: UploadFormStepProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const newCat: any = await categoriesService.create({ name: newCategoryName });
      const addedCat = newCat.data || newCat.category || newCat;
      setCategories(prev => [...prev, addedCat]);
      setCategoryId(addedCat._id || addedCat.id);
      setIsAddingCategory(false);
      setNewCategoryName("");
    } catch (err) {
      console.error("Failed to create category", err);
      setError("Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoriesService.getAll();
        setCategories(cats);
        if (cats.length > 0) {
          setCategoryId((cats[0]._id || cats[0].id) as string || "");
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = () => {
    if (!title || title.length < 3) {
      setError("Title must be at least 3 characters.");
      return;
    }
    if (!description || description.length < 50) {
      setError("Description must be at least 50 characters.");
      return;
    }
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    if (!file) {
      setError("Please select a template file.");
      return;
    }
    setError("");
    onNext({ title, description, price: isPaid ? price : 0, categoryId, file, image: image || undefined, tags });
  };
  return (
    <motion.div 
      key="form"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full"
    >
      <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
        <span>Step 1 of 2</span>
        <span>Template Details</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full mb-10 overflow-hidden">
        <div className="h-full bg-[#123E41] w-1/2 rounded-full"></div>
      </div>

      <div className="space-y-6">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Template Name<span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41]"
          />
        </div>

        {/* Category */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-bold text-[#103B40]">
              Category<span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="text-xs font-semibold text-[#123E41] hover:underline"
            >
              {isAddingCategory ? "Cancel" : "+ Add Category"}
            </button>
          </div>
          
          <AnimatePresence mode="wait">
            {isAddingCategory ? (
              <motion.div
                key="add-category"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name..."
                  className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41]"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={isCreatingCategory || !newCategoryName.trim()}
                  className="bg-[#123E41] text-white px-6 rounded-xl font-semibold hover:bg-[#0d2c2e] disabled:opacity-50 transition-colors"
                >
                  {isCreatingCategory ? "..." : "Add"}
                </button>
              </motion.div>
            ) : (
              <motion.select 
                key="select-category"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={categoriesLoading || categories.length === 0}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41] disabled:bg-gray-100 disabled:text-gray-500"
              >
                {categoriesLoading ? (
                  <option>Loading categories...</option>
                ) : categories.length === 0 ? (
                  <option>No categories found</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat._id || cat.id} value={cat._id || cat.id}>
                      {cat.name}
                    </option>
                  ))
                )}
              </motion.select>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41] resize-none"
          ></textarea>
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs text-gray-400">Minimum 50 characters</p>
          </div>
        </div>

        {/* Template Files */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Template Files<span className="text-red-500">*</span>
          </label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CloudUpload className="text-gray-400" size={24} />
            </div>
            {file ? (
              <p className="text-sm text-[#123E41] font-bold">{file.name}</p>
            ) : (
              <>
                <p className="text-sm text-gray-700 font-medium">Click to browse your files here</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="hidden" 
            accept=".zip,.rar,.tar.gz" 
          />
          
          <div className="mt-4 space-y-1.5">
            <div className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info size={10} className="text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-blue-600">Allowed:</span> <span className="text-blue-400">.zip, .rar, .tar.gz (Max 50MB)</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs pl-6">
                <span className="font-semibold text-blue-600">Security:</span> <span className="text-blue-400">All files are scanned for viruses</span>
            </div>
            <div className="flex items-start gap-2 text-xs pl-6">
                <span className="font-semibold text-blue-600">Include:</span> <span className="text-blue-400">README, source code, documentation</span>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Cover Image <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div 
            onClick={() => imageInputRef.current?.click()}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <CloudUpload className="text-gray-400" size={20} />
            </div>
            <div className="flex-1">
              {image ? (
                <p className="text-sm text-[#123E41] font-bold">{image.name}</p>
              ) : (
                <p className="text-sm text-gray-700 font-medium">Click to upload thumbnail/cover</p>
              )}
            </div>
          </div>
          <input 
            type="file" 
            ref={imageInputRef} 
            onChange={(e) => setImage(e.target.files?.[0] || null)} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Pricing Model */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Pricing Model<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setIsPaid(false)} className={`bg-white border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer ${!isPaid ? 'border-green-500/50 bg-green-50' : 'border-gray-100 hover:border-green-500/30'}`}>
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white flex-shrink-0">
                <Gift size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Free</p>
                <p className="text-xs text-gray-500">Open source</p>
              </div>
            </div>
            <div onClick={() => setIsPaid(true)} className={`bg-white border-2 rounded-xl p-4 flex items-center gap-3 cursor-pointer ${isPaid ? 'border-amber-500/50 bg-amber-50' : 'border-gray-100 hover:border-amber-500/30'}`}>
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white flex-shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Paid</p>
                {isPaid ? (
                  <input type="number" min="1" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price $" onClick={(e) => e.stopPropagation()} className="w-16 bg-transparent border-b border-amber-300 outline-none mt-1" />
                ) : (
                  <p className="text-xs text-gray-500">Set price</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-bold text-[#103B40] mb-2">
            Tags<span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input 
            type="text" 
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. react, dashboard, admin"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#123E41]"
          />
          <p className="text-xs text-gray-500 mt-1.5">Separate tags with commas</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button className="flex-1 bg-[#A5C9D3]/70 text-[#123E41] font-bold py-3.5 rounded-xl hover:bg-[#A5C9D3] transition-colors">
            Save as Draft
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-[#123E41] text-white font-bold py-3.5 rounded-xl hover:bg-[#0d2c2e] transition-colors"
          >
            Submit Template
          </button>
        </div>
      </div>
    </motion.div>
  );
}
