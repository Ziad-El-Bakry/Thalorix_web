"use client";

import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";

// Mock data representing the templates in the design
const TEMPLATES = [
  {
    id: 1,
    title: "E-Commerce Store",
    price: 50,
    imageSrc: "/images/Market-Place/ecommerce.png", // Paths will need valid images
  },
  {
    id: 2,
    title: "Social Media",
    price: 40,
    imageSrc: "/images/Market-Place/Social Media.jfif",
  },
  {
    id: 3,
    title: "Resturant Website", // Typo in design "Resturant"
    price: 55,
    imageSrc: "/images/Market-Place/restaurant.png",
  },
  {
    id: 4,
    title: "Mobile App",
    price: 40,
    imageSrc: "/images/Market-Place/mobileapp.png",
  },
  {
    id: 5,
    title: "Portofolio Website", // Typo in design "Portofolio"
    price: 25,
    imageSrc: "/images/Market-Place/portfolio.png",
  },
  {
    id: 6,
    title: "Admin Dashboard",
    price: 60,
    imageSrc: "/images/Market-Place/dashboard.png",
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

export default function TemplateList() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-10"
    >
      {TEMPLATES.map((template) => (
        <TemplateCard key={template.id} {...template} />
      ))}
    </motion.div>
  );
}