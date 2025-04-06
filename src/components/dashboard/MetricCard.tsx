import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  description?: string;
  className?: string;
  onClick?: () => void;
}

const MetricCard = ({
  title = "Metric",
  count = 0,
  icon: Icon = () => null,
  description = "Description of this metric",
  className = "",
  onClick,
}: MetricCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer",
        onClick ? "cursor-pointer" : "cursor-default",
      )}
    >
      <Card
        className={cn(
          "relative overflow-hidden bg-white/70 backdrop-blur-md border-gray-100/50 shadow-lg p-6",
          "hover:shadow-gray-200/30 hover:border-gray-200/60 transition-all duration-300",
          className,
        )}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-gray-50/10 backdrop-blur-[8px] z-0" />

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-3xl font-bold mt-2 text-gray-800">
              {count.toLocaleString()}
            </p>
            <p className="text-sm text-gray-700/70 mt-2">{description}</p>
          </div>

          <div className="p-3 rounded-full bg-gray-100/50 text-gray-700">
            <Icon size={24} />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gray-200/20 z-0" />
        <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-gray-100/30 z-0" />
      </Card>
    </motion.div>
  );
};

export default MetricCard;
