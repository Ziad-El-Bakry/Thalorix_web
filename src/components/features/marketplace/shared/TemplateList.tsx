"use client";

import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";

// Mock data representing the templates in the design
const TEMPLATES = [
  {
    id: 1,
    title: "E-Commerce Store",
    price: 50,
    imageSrc: "/images/Market-Place/ecommerce.png",
    category: "E-Commerce",
  },
  {
    id: 2,
    title: "Social Media",
    price: 40,
    imageSrc: "/images/Market-Place/social-media.png",
    category: "Social Media",
  },
  {
    id: 3,
    title: "Resturant Website",
    price: 55,
    imageSrc: "/images/Market-Place/restaurant.png",
    category: "Restaurant",
  },
  {
    id: 4,
    title: "Mobile App",
    price: 40,
    imageSrc: "/images/Market-Place/mobileapp.png",
    category: "Dashboard",
  },
  {
    id: 5,
    title: "Portofolio Website",
    price: 25,
    imageSrc: "/images/Market-Place/portfolio.png",
    category: "Portfolio",
  },
  {
    id: 6,
    title: "Admin Dashboard",
    price: 60,
    imageSrc: "/images/Market-Place/dashboard.png",
    category: "Dashboard",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface TemplateListProps {
  searchQuery?: string;
  category?: string;
  sortBy?: string;
}

export default function TemplateList({ searchQuery = "", category = "All Categories", sortBy = "Newest First" }: TemplateListProps) {
  let filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch = searchQuery === "" || template.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All Categories" || template.category === category;
    return matchesSearch && matchesCategory;
  });

  // Sorting logic
  filteredTemplates.sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Popularity") return a.id - b.id; // Mock popularity by id
    return b.id - a.id; // Default "Newest First", reverse mock id order
  });

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-10"
    >
      {filteredTemplates.map((template) => (
        <TemplateCard key={template.id} {...template} />
      ))}
      {filteredTemplates.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-xl font-medium mb-2">No templates found</p>
          <p className="text-sm">We couldn&apos;t find anything matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </motion.div>
  );
}