import React from "react";

const StatistikPage = () => {
  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Statistik</h1>
        <p className="text-gray-600">Analisis statistik pertandingan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-md border border-blue-100/50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Statistik Tim
          </h3>

          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Tim {i}</span>
                  <span className="text-sm font-medium text-blue-600">
                    {Math.floor(Math.random() * 10)} Kemenangan
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pertandingan</span>
                    <span className="font-medium">
                      {Math.floor(Math.random() * 15) + 5}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Menang</span>
                    <span className="font-medium text-green-600">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kalah</span>
                    <span className="font-medium text-red-600">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Seri</span>
                    <span className="font-medium text-gray-600">
                      {Math.floor(Math.random() * 5)}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="h-2 bg-blue-100 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md border border-blue-100/50 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Statistik Atlit Terbaik
          </h3>

          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {i}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Atlit {i + 10}</span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.floor(Math.random() * 50) + 10} Poin
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tim {(i % 4) + 1}</span>
                    <span className="text-gray-500">
                      {Math.floor(Math.random() * 10)} Kemenangan
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Kategori Terpopuler
            </h3>

            <div className="space-y-3">
              {["A", "B", "C"].map((category, i) => (
                <div key={category} className="flex items-center">
                  <div className="w-24 text-sm font-medium">
                    Kategori {category}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-blue-100 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${90 - i * 30}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {10 - i * 3} P
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistikPage;
