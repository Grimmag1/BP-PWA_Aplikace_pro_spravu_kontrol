import type { Zavada } from "../types.tsx";

function ZavadaItem({
  zavada,
  onStavChange,
}: {
  zavada: Zavada;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
}) {
  const nextStav = (current: Zavada["stav"]): Zavada["stav"] => {
    if (current === "nesoulad") return "soulad";
    if (current === "soulad") return "v_procesu";
    if (current === "v_procesu") return "nesoulad";
    return "nesoulad";
  };

  const barva: Record<string, string> = {
    nesoulad: "#e53935",
    v_procesu: "#fb8c00",
    soulad: "#43a047",
  };

  const stavLeft: Record<string, string> = {
    nesoulad: "4px",
    v_procesu: "calc(50% - 12px)",
    soulad: "calc(100% - 28px)",
    null: "4px",
  };

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
      {
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <p
            style={{
              fontWeight: "bold",
              margin: 0,
            }}
          >
            {zavada.poradoveCislo}/{zavada.zdrojKontrola} {zavada.name}
          </p>
          <div
            onClick={() => onStavChange?.(zavada.id, nextStav(zavada.stav))}
            style={{
              position: "relative",
              width: "80px",
              height: "32px",
              backgroundColor: "#e0e0e0",
              borderRadius: "20px",
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "4px",
                left: stavLeft[zavada.stav],
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor:
                  zavada.stav !== "null" ? barva[zavada.stav] : "#999",
                transition: "left 0.25s ease, background-color 0.25s ease",
              }}
            />
          </div>
        </div>
      }

      <div style={{ borderBottom: "1px dashed #ccc", marginBottom: "8px" }} />

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "8px",
        }}
      >
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
