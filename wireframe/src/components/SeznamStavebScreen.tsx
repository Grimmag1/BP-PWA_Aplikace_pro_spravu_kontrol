import { useNavigate } from "react-router-dom";

function SeznamStavebScreen() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Seznam staveb</h1>
      <button onClick={() => navigate("/zapis")}>Button</button>
    </div>
  );
}

export default SeznamStavebScreen;
