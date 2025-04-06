import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import MetricCardGrid from "./dashboard/MetricCardGrid";
import GlassContainer from "./ui/GlassContainer";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  BarChart2,
  FileBarChart,
  Settings,
  ChevronRight,
  LogOut,
  Award,
  ClipboardList,
} from "lucide-react";
import Sidebar from "./layout/Sidebar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-700">
              Welcome to Kejuaraan Pencak Silat Management System
            </p>
          </header>

          <MetricCardGrid className="mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Manajemen Atlit
                  </CardTitle>
                  <Users className="h-5 w-5 text-gray-700" />
                </div>
                <CardDescription>Kelola data atlit kejuaraan</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">
                  Tambah, edit, dan hapus data atlit dengan mudah. Lihat
                  informasi lengkap tentang atlit.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/atlit" className="w-full">
                  <Button variant="outline" className="w-full">
                    Buka Halaman Atlit
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Manajemen Pelatih
                  </CardTitle>
                  <Award className="h-5 w-5 text-gray-700" />
                </div>
                <CardDescription>Kelola data pelatih</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">
                  Tambah, edit, dan hapus data pelatih. Lihat informasi lengkap
                  tentang pelatih.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/pelatih" className="w-full">
                  <Button variant="outline" className="w-full">
                    Buka Halaman Pelatih
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Pendaftaran
                  </CardTitle>
                  <ClipboardList className="h-5 w-5 text-gray-700" />
                </div>
                <CardDescription>Kelola pendaftaran kejuaraan</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">
                  Tambah, edit, dan hapus data pendaftaran. Lihat informasi
                  lengkap tentang pendaftaran.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/pendaftaran" className="w-full">
                  <Button variant="outline" className="w-full">
                    Buka Halaman Pendaftaran
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Bagan Pertandingan
                  </CardTitle>
                  <BarChart2 className="h-5 w-5 text-gray-700" />
                </div>
                <CardDescription>Kelola bagan pertandingan</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">
                  Tambah, edit, dan hapus data bagan pertandingan. Lihat
                  informasi lengkap tentang bagan pertandingan.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/bagan" className="w-full">
                  <Button variant="outline" className="w-full">
                    Buka Halaman Bagan
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    Laporan
                  </CardTitle>
                  <FileText className="h-5 w-5 text-gray-700" />
                </div>
                <CardDescription>Kelola laporan kejuaraan</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">
                  Lihat dan unduh berbagai laporan kejuaraan. Analisis data
                  kejuaraan.
                </p>
              </CardContent>
              <CardFooter>
                <Link to="/laporan" className="w-full">
                  <Button variant="outline" className="w-full">
                    Buka Halaman Laporan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
