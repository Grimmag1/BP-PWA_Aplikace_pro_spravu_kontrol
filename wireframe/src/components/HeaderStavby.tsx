// src/components/HeaderStavby.tsx
import type { Stavba } from "../types.tsx";
import { useNavigate } from "react-router-dom";

function HeaderStavby({ stavba }: { stavba: Stavba }) {
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ←
        </button>

        <h1 style={{ flex: 1, textAlign: "center" }}>{stavba.jmeno}</h1>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
        }}
      >
        <p>Kontrola č. {stavba.cisloKontroly}</p>
      </div>
    </div>
  );
}

export default HeaderStavby;
