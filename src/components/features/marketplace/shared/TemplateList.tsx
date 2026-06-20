"use client";

import { motion } from "framer-motion";
import TemplateCard from "./TemplateCard";

import { Template } from "@/types";

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
  templates: Template[];
}

export default function TemplateList({ templates }: TemplateListProps) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6 pb-10"
    >
      {templates.map((template) => {
        const sellerObj = (template as any).developerId || (template as any).sellerId;
        return (
          <TemplateCard 
            key={template._id || template.id} 
            id={(template._id || template.id) as string}
            title={template.title}
            price={template.price}
            imageSrc={template.image || template.imageUrl || ""}
            category={(template as any).categoryId?.name}
            seller={sellerObj?.name}
            sellerId={sellerObj?._id || sellerObj?.id}
          />
        );
      })}
      {templates.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-xl font-medium mb-2">No templates found</p>
          <p className="text-sm">Check back later for new uploads!</p>
        </div>
      )}
    </motion.div>
  );
}