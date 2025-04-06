import React from "react";
import { cn } from "@/lib/utils";
import MetricCard from "./MetricCard";
import {
  Users,
  BookOpen,
  FileText,
  BarChart2,
  FileBarChart,
} from "lucide-react";

interface MetricData {
  title: string;
  count: number;
  icon: React.ElementType;
  description: string;
  onClick?: () => void;
}

interface MetricCardGridProps {
  metrics?: MetricData[];
  className?: string;
}

const MetricCardGrid = ({
  metrics = [
    {
      title: "Atlit",
      count: 248,
      icon: Users,
      description: "Total registered athletes",
      onClick: () => console.log("Navigating to Atlit section"),
    },
    {
      title: "Pelatih",
      count: 42,
      icon: BookOpen,
      description: "Registered coaches",
      onClick: () => console.log("Navigating to Pelatih section"),
    },
    {
      title: "Pendaftaran",
      count: 156,
      icon: FileText,
      description: "Active registrations",
      onClick: () => console.log("Navigating to Pendaftaran section"),
    },
    {
      title: "Bagan Pertandingan",
      count: 32,
      icon: BarChart2,
      description: "Tournament brackets",
      onClick: () => console.log("Navigating to Bagan Pertandingan section"),
    },
    {
      title: "Laporan",
      count: 87,
      icon: FileBarChart,
      description: "Generated reports",
      onClick: () => console.log("Navigating to Laporan section"),
    },
  ],
  className = "",
}: MetricCardGridProps) => {
  return (
    <div
      className={cn(
        "w-full bg-white/70 backdrop-blur-md rounded-xl p-6 border border-gray-100/40",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            count={metric.count}
            icon={metric.icon}
            description={metric.description}
            onClick={metric.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default MetricCardGrid;
