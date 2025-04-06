import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart2 } from "lucide-react";

const LaporanPage = () => {
  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
        <p className="text-gray-600">Lihat hasil pertandingan dan statistik</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-100/50 rounded-xl shadow-lg p-6">
        <Tabs defaultValue="hasil">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="hasil" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Hasil Pertandingan</span>
            </TabsTrigger>
            <TabsTrigger value="statistik" className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>Statistik</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hasil" className="space-y-4">
            <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-100/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hasil Pertandingan Terbaru
              </h3>
              <div className="space-y-3">
                {/* Placeholder for match results */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        A{i}
                      </div>
                      <div>
                        <p className="font-medium">Atlit {i}</p>
                        <p className="text-sm text-gray-500">Tim {i}</p>
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <span className="text-xl font-bold">
                        {Math.floor(Math.random() * 5)} -{" "}
                        {Math.floor(Math.random() * 5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-right">Atlit {i + 3}</p>
                        <p className="text-sm text-gray-500 text-right">
                          Tim {i + 3}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        A{i + 3}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Lihat Semua Hasil
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="statistik" className="space-y-4">
            <div className="bg-blue-50/50 backdrop-blur-sm border border-blue-100/50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Statistik Pertandingan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Total Pertandingan
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                  <div className="h-2 bg-blue-100 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Pertandingan Selesai
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                  <div className="h-2 bg-blue-100 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Pertandingan Mendatang
                  </h4>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                  <div className="h-2 bg-blue-100 rounded-full mt-2">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Performa Tim
                </h4>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-24 text-sm font-medium">Tim {i}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-blue-100 rounded-full">
                          <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.floor(Math.random() * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-right text-sm font-medium">
                        {Math.floor(Math.random() * 10)} W
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LaporanPage;
