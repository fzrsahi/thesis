"use client";

import { motion } from "framer-motion";
import { Users, Trophy, BookOpen, Calendar, Target, BarChart3, Activity } from "lucide-react";
import { useState, useEffect } from "react";

import { TypographyH2, TypographyP } from "@/components/ui/typography";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * (end - startCount) + startCount);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Stats Card Component
const StatsCard = ({
  icon: Icon,
  title,
  value,
  change,
  changeType = "positive",
  color = "blue",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: number | string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color?: "blue" | "green" | "purple" | "orange" | "red";
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600",
  };

  const changeClasses = {
    positive: "text-green-600 bg-green-100",
    negative: "text-red-600 bg-red-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <motion.div
      variants={staggerItem}
      className="group relative overflow-hidden rounded-xl border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-zinc-300">{title}</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl font-bold text-white">
              {typeof value === "number" ? <AnimatedCounter end={value} /> : value}
            </p>
            {change && (
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${changeClasses[changeType]}`}
              >
                {change}
              </span>
            )}
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r ${colorClasses[color]} shadow-lg transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

// Chart Component (Simple Bar Chart)
const SimpleBarChart = ({
  data,
  title,
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white shadow-xl backdrop-blur-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center space-x-3">
            <div className="w-20 truncate text-sm text-zinc-300">{item.label}</div>
            <div className="relative h-6 flex-1 overflow-hidden rounded-full bg-zinc-700/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.value / maxValue) * 100}%` }}
                transition={{ duration: 1, delay: data.indexOf(item) * 0.1 }}
                className={`h-full rounded-full ${item.color}`}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Recent Activity Component
const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      action: "Kompetisi baru ditambahkan",
      competition: "PKM 2024",
      time: "2 jam yang lalu",
      type: "competition",
    },
    {
      id: 2,
      action: "Mahasiswa mendaftar",
      student: "Ahmad Rizki",
      competition: "Hackathon Nasional",
      time: "4 jam yang lalu",
      type: "registration",
    },
    {
      id: 3,
      action: "Dokumen diupload",
      competition: "Lomba Robotik",
      time: "6 jam yang lalu",
      type: "upload",
    },
    {
      id: 4,
      action: "Rekomendasi diberikan",
      student: "Siti Nurhaliza",
      time: "8 jam yang lalu",
      type: "recommendation",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "competition":
        return Trophy;
      case "registration":
        return Users;
      case "upload":
        return BookOpen;
      case "recommendation":
        return Target;
      default:
        return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "competition":
        return "text-blue-600 bg-blue-100";
      case "registration":
        return "text-green-600 bg-green-100";
      case "upload":
        return "text-purple-600 bg-purple-100";
      case "recommendation":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <motion.div
      variants={staggerItem}
      className="rounded-xl border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white shadow-xl backdrop-blur-sm"
    >
      <h3 className="mb-4 text-lg font-semibold text-white">Aktivitas Terbaru</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type);
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {activity.action}
                  {activity.competition && (
                    <span className="text-zinc-300"> - {activity.competition}</span>
                  )}
                  {activity.student && <span className="text-zinc-300"> ({activity.student})</span>}
                </p>
                <p className="text-xs text-zinc-400">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  // Mock data - nanti bisa diganti dengan data real dari API
  const statsData = [
    {
      icon: Users,
      title: "Total Mahasiswa",
      value: 1250,
      change: "+12%",
      changeType: "positive" as const,
      color: "blue" as const,
    },
    {
      icon: Trophy,
      title: "Kompetisi Aktif",
      value: 45,
      change: "+5",
      changeType: "positive" as const,
      color: "green" as const,
    },
    {
      icon: Target,
      title: "Rekomendasi Diberikan",
      value: 890,
      change: "+15%",
      changeType: "positive" as const,
      color: "orange" as const,
    },
    {
      icon: Calendar,
      title: "Deadline Mendekat",
      value: 8,
      change: "&lt; 7 hari",
      changeType: "neutral" as const,
      color: "red" as const,
    },
  ];

  const chartData = [
    { label: "PKM", value: 45, color: "bg-blue-500" },
    { label: "Hackathon", value: 32, color: "bg-green-500" },
    { label: "Robotik", value: 28, color: "bg-purple-500" },
    { label: "Desain", value: 24, color: "bg-orange-500" },
    { label: "Lainnya", value: 18, color: "bg-gray-500" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 truncate text-zinc-900">
          <BarChart3 className="h-10 w-10 font-extrabold" />
          Dashboard Statistik
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Selamat datang di dashboard sistem rekomendasi kompetisi akademik
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <div className="flex justify-center">
        <div className="w-full space-y-8">
          {/* Stats Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {statsData.map((stat) => (
              <StatsCard key={stat.title} {...stat} />
            ))}
          </motion.div>

          {/* Charts and Activity Row */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
          >
            {/* Chart */}
            <SimpleBarChart data={chartData} title="Kompetisi Populer" />

            {/* Recent Activity */}
            <RecentActivity />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
