import type { Stavba } from "../types";

function StavbaItem({
  stavba,
  onNovyZapis,
}: {
  stavba: Stavba;
  onNovyZapis: (stavbaId: number) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "8px",
        backgroundColor: "#fff",
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
