import { useState } from "react";
import type { Zavada } from "../types.tsx";
import ZavadaItem from "./ZavadaItem.tsx";
import AddZavadaButton from "./AddZavadaButton.tsx";

function SekceZavad({
  nazev,
  zavady,
  showAddButton = false,
  onStavChange,
  onPridatZavadu,
}: {
  nazev: string;
  zavady: Zavada[];
  showAddButton?: boolean;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
  onPridatZavadu?: () => void;
}) {
  const [rozbaleno, setRozbaleno] = useState(true);

  return (
    <div>
      <div
        onClick={() => setRozbaleno(!rozbaleno)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          backgroundColor: "#f0f0f0",
          padding: "8px 12px",
        }}
      >
        <h2>{nazev}</h2>
        <span>{rozbaleno ? "Skrýt" : "Zobrazit"}</span>
      </div>

      {rozbaleno && (
        <div>
          {zavady.length === 0 && (
            <p
              style={{
                textAlign: "center",
                color: "#999",
                padding: "16px",
                fontStyle: "italic",
              }}
            >
              Zatím žádné závady
            </p>
          )}
          {zavady.map((zavada) => (
            <ZavadaItem
              key={zavada.id}
              zavada={zavada}
              onStavChange={onStavChange}
            />
          ))}
        </div>
      )}

      {showAddButton && <AddZavadaButton onBezFotky={onPridatZavadu} />}
    </div>
  );
}

export default SekceZavad;
