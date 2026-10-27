import ZapisScreen from "./screens/ZapisScreen.tsx";
import SeznamStavebScreen from "./screens/SeznamStavebScreen.tsx";
import StavbaInfoScreen from "./screens/StavbaInfoScreen.tsx";
import ZavadaInfoScreen from "./screens/ZavadaInfoScreen.tsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeznamStavebScreen />} />
      <Route path="/stavba/:stavbaId/zapis/" element={<ZapisScreen />}>
        <Route path="zavada/:zavadaId" element={<ZavadaInfoScreen />} />
      </Route>
      <Route path="/stavba/:stavbaId/info" element={<StavbaInfoScreen />} />
    </Routes>
  );
}

export default App;
