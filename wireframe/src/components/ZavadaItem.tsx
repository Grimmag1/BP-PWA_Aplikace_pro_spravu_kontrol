import { useState } from "react";
import type { Zavada } from "../types.tsx";

function ZavadaItem({ zavada }: { zavada: Zavada }) {
  const [stav, setStav] = useState(zavada.stav);

  const cycleStav = () => {
    setStav((s) => {
      if (s === "nesoulad") return "soulad";
      else if (s === "soulad") return "v_procesu";
      else if (s === "v_procesu") return "nesoulad";
      return "null";
    });
  };
  const stavConfig = {
    nesoulad: { barva: "#e53935", symbol: "✕" },
    soulad: { barva: "#43a047", symbol: "✓" },
    v_procesu: { barva: "#fb8c00", symbol: "–" },
    null: { barva: "white", symbol: "" },
  };

  const { barva, symbol } = stavConfig[stav];

  return (
    <div
      style={{
        border: "1px solid #ccc",
        backgroundColor: zavada.id % 2 ? "#fce4ec" : "#f3e5f5",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        position: "relative",
      }}
    >
      {stav !== "null" && (
        <button
          onClick={cycleStav}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: barva,
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {symbol}
        </button>
      )}
      <p
        style={{
          fontWeight: "bold",
          borderBottom: "1px dashed #ccc",
          paddingBottom: "4px",
          textAlign: "left",
        }}
      >
        {zavada.poradoveCislo}/{zavada.cisloKontroly} {zavada.name}
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <p style={{ flex: 1, textAlign: "left" }}>
          {zavada.primaryDescription}
        </p>
        {zavada.foto ? (
          <img
            src={zavada.foto}
            alt="foto závady"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
        ) : (
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#eee",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "12px", color: "#999" }}>Bez fotky</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ZavadaItem;
