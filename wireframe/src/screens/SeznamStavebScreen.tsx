import { useNavigate } from "react-router-dom";
import { mockStavby } from "../mockdata.ts";
import StavbaItem from "../components/StavbaItem.tsx";
import { useState } from "react";

function SeznamStavebScreen() {
  const navigate = useNavigate();
  const handleNovyZapis = (stavbaId: number) => {
    navigate(`/stavba/${stavbaId}/zapis/`);
  };
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
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
          openPopoverId={openPopoverId}
          setOpenPopoverId={setOpenPopoverId}
        />
      ))}
    </div>
  );
}

export default SeznamStavebScreen;
