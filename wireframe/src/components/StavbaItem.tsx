import type { Stavba } from "../types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HOLD_DELAY = 1000;

function StavbaItem({
  stavba,
  onNovyZapis,
}: {
  stavba: Stavba;
  onNovyZapis: (stavbaId: number) => void;
}) {
  const navigate = useNavigate();

  const startPress = useRef<number | null>(null);
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = () => {
    startPress.current = Date.now();
    setPressed(true);
  };
  const handleMouseUp = () => {
    setPressed(false);
    if (startPress.current && Date.now() - startPress.current > HOLD_DELAY) {
      navigate(`/stavba?stavbaId=${stavba.id}`);
    }
    startPress.current = null;
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: pressed ? "#d0d0d0" : "#fff",
        transition: pressed
          ? `background-color ${HOLD_DELAY}ms ease`
          : "background-color 0.1s ease",
        userSelect: "none",
      }}
    >
      <p style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
        {stavba.jmeno}
      </p>
      <p style={{ color: "#666", fontSize: "14px" }}>{stavba.adresa}</p>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Zhotovitel: {stavba.zhotovitel}
      </p>
      <button
        onClick={() => onNovyZapis(stavba.id)}
        style={{
          marginTop: "8px",
          width: "100%",
          padding: "8px",
          backgroundColor: "#6a0dad",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Nový zápis
      </button>
    </div>
  );
}

export default StavbaItem;
