import ZapisScreen from "./components/ZapisScreen.tsx";
import SeznamStavebScreen from "./components/SeznamStavebScreen.tsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SeznamStavebScreen />} />
      <Route path="/zapis" element={<ZapisScreen />} />
    </Routes>
  );
}

export default App;
