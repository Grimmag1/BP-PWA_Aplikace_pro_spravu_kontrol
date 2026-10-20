import ZapisScreen from "./screens/ZapisScreen.tsx";
import SeznamStavebScreen from "./screens/SeznamStavebScreen.tsx";
import StavbaInfoScreen from "./screens/StavbaInfoScreen.tsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeznamStavebScreen />} />
      <Route path="/zapis" element={<ZapisScreen />} />
      <Route path="/stavba" element={<StavbaInfoScreen />} />
    </Routes>
  );
}

export default App;
