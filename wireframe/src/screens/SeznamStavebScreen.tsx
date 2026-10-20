import { useNavigate } from "react-router-dom";
import { mockStavby } from "../mockdata.ts";
import StavbaItem from "../components/StavbaItem.tsx";

function SeznamStavebScreen() {
  const navigate = useNavigate();
  const handleNovyZapis = (stavbaId: number) => {
    navigate(`/zapis?stavbaId=${stavbaId}`);
  };
  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "16px" }}>
        Seznam staveb
      </h1>
      {mockStavby.map((stavba) => (
        <StavbaItem
          key={stavba.id}
          stavba={stavba}
          onNovyZapis={handleNovyZapis}
        />
      ))}
    </div>
  );
}

export default SeznamStavebScreen;
