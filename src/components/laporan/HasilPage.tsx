import React from "react";

const HasilPage = () => {
  return (
    <div className="p-6 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Hasil Pertandingan</h1>
        <p className="text-gray-600">Detail hasil semua pertandingan</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-100/50 rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <select className="bg-white/70 border border-blue-100 rounded-lg px-3 py-2 text-sm">
              <option>Semua Kategori</option>
              <option>Kategori A</option>
              <option>Kategori B</option>
              <option>Kategori C</option>
            </select>
            <select className="bg-white/70 border border-blue-100 rounded-lg px-3 py-2 text-sm">
              <option>Semua Tim</option>
              <option>Tim 1</option>
              <option>Tim 2</option>
              <option>Tim 3</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Cari hasil..."
              className="bg-white/70 border border-blue-100 rounded-lg px-3 py-2 text-sm w-64"
            />
          </div>
        </div>

        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-sm border border-blue-100/30 rounded-lg p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-blue-600">
                  Kategori {String.fromCharCode(65 + (i % 3))}
                </span>
                <span className="text-sm text-gray-500">Match #{i + 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    A{i * 2 + 1}
                  </div>
                  <div>
                    <p className="font-medium">Atlit {i * 2 + 1}</p>
                    <p className="text-sm text-gray-500">Tim {(i % 4) + 1}</p>
                  </div>
                </div>
                <div className="text-center px-6">
                  <div className="text-2xl font-bold">
                    {Math.floor(Math.random() * 5)} -{" "}
                    {Math.floor(Math.random() * 5)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(2023, 5, i + 1).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-right">Atlit {i * 2 + 2}</p>
                    <p className="text-sm text-gray-500 text-right">
                      Tim {((i + 2) % 4) + 1}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    A{i * 2 + 2}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-50 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Wasit: Wasit {(i % 3) + 1}
                </span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-blue-100 bg-white/70">
              &lt;
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${page === 1 ? "bg-blue-600 text-white" : "border border-blue-100 bg-white/70"}`}
              >
                {page}
              </button>
            ))}
            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-blue-100 bg-white/70">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HasilPage;
