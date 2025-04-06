import React from "react";
import { cn } from "@/lib/utils";
import Sidebar from "../layout/Sidebar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { ClipboardList, Plus, Search } from "lucide-react";
import { Input } from "../ui/input";

const RegistrationPage = () => {
  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-50 to-white">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pendaftaran</h1>
              <p className="text-gray-700">
                Kelola pendaftaran kejuaraan pencak silat
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Tambah Pendaftaran
            </Button>
          </header>

          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Cari pendaftaran..."
                className="pl-10 bg-white/70 backdrop-blur-sm border border-gray-200/50"
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">Filter</Button>
              <Button variant="outline">Export</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="bg-white/70 backdrop-blur-md border border-gray-100/50 hover:shadow-lg transition-all"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Pendaftaran #{item}
                    </CardTitle>
                    <ClipboardList className="h-5 w-5 text-gray-700" />
                  </div>
                  <CardDescription>
                    {new Date().toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Atlit:</span>
                      <span className="text-sm font-medium">
                        Nama Atlit {item}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Kategori:</span>
                      <span className="text-sm font-medium">
                        Tanding - Kelas {String.fromCharCode(64 + item)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span className="text-sm font-medium text-green-600">
                        Terdaftar
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Lihat Detail
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
