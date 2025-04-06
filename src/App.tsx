import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import AthletePage from "./components/atlit/AthletePage";
import CoachPage from "./components/pelatih/CoachPage";
import BracketPage from "./components/bagan/BracketPage";
import RegistrationPage from "./components/pendaftaran/RegistrationPage";
import LaporanPage from "./components/laporan/LaporanPage";
import HasilPage from "./components/laporan/HasilPage";
import StatistikPage from "./components/laporan/StatistikPage";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/atlit" element={<AthletePage />} />
          <Route path="/pelatih" element={<CoachPage />} />
          <Route path="/bagan" element={<BracketPage />} />
          <Route path="/pendaftaran" element={<RegistrationPage />} />
          <Route path="/laporan" element={<LaporanPage />} />
          <Route path="/laporan/hasil" element={<HasilPage />} />
          <Route path="/laporan/statistik" element={<StatistikPage />} />
          {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
