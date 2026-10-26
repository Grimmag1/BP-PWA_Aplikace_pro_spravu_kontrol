import { useNavigate, useParams } from "react-router-dom";
import { mockStavby } from "../mockdata";
import { useState } from "react";

function ZavadaInfoScreen() {
  const { stavbaId, zapisId, zavadaId } = useParams();
  const navigate = useNavigate();

  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const zapis =
    stavba.zapisy.find((z) => z.id === Number(zapisId)) ??
    stavba.zapisy[stavba.zapisy.length - 1];
  const zavada = zapis.zavady.find((z) => z.id === Number(zavadaId))!;

  const [name, setName] = useState(zavada.name);
  const [primaryDescription, setPrimaryDescription] = useState(
    zavada.primaryDescription,
  );
  const [secondaryDescription, setSecondaryDescription] = useState(
    zavada.secondaryDescription,
  );

  const zmenaProvedena =
    name !== zavada.name ||
    primaryDescription !== zavada.primaryDescription ||
    secondaryDescription !== zavada.secondaryDescription;

  const handleUlozit = () => {
    const stavbaIndex = mockStavby.findIndex((s) => s.id === Number(stavbaId));
    const zapisIndex = mockStavby[stavbaIndex].zapisy.findIndex(
      (z) => z.id === zapis.id,
    );
    const zavadaIndex = mockStavby[stavbaIndex].zapisy[
      zapisIndex
    ].zavady.findIndex((z) => z.id === zavada.id);

    mockStavby[stavbaIndex].zapisy[zapisIndex].zavady[zavadaIndex] = {
      ...zavada,
      name,
      primaryDescription,
      secondaryDescription,
    };

    navigate(-1);
  };

  const handleStorno = () => {
    setName(zavada.name);
    setPrimaryDescription(zavada.primaryDescription);
    setSecondaryDescription(zavada.secondaryDescription);
    navigate(-1);
  };

  const handleZavrit = () => {
    if (zmenaProvedena) {
      if (window.confirm("Máte neuložené změny. Chcete je uložit?")) {
        handleUlozit();
      } else {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    marginBottom: "8px",
    boxSizing: "border-box" as const,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fce4ec",
          padding: "16px",
          width: "100%",
          height: "100%",
          position: "relative",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <button
          onClick={handleZavrit}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          X
        </button>

        <input
          readOnly
          value={`Závada č. ${zavada.poradoveCislo}`}
          style={inputStyle}
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Název závady"
          style={inputStyle}
        />

        <textarea
          defaultValue={primaryDescription}
          onChange={(e) => setPrimaryDescription(e.target.value)}
          placeholder="Prvotní popis (viditelný v přehledu závad)"
          rows={3}
          style={{ ...inputStyle, flex: 1 }}
        />

        <textarea
          value={secondaryDescription}
          onChange={(e) => setSecondaryDescription(e.target.value)}
          placeholder="Sekundární popis (viditelný v detailu závady)"
          rows={3}
          style={{ ...inputStyle, flex: 1 }}
        />

        <div
          style={{
            ...inputStyle,
            flex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#999" }}>Vložit foto/otevřít kameru</p>
        </div>

        <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
          <button
            onClick={handleStorno}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#e53935",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Storno
          </button>
          <button
            onClick={handleUlozit}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#43a047",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Uložit
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZavadaInfoScreen;
