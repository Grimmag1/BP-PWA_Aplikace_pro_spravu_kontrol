import { useState } from "react";

function AddZavadaButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <>
      {clicked && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <button onClick={() => setClicked(false)}>Fotoaparát</button>
          <button onClick={() => setClicked(false)}>Galerie</button>
          <button onClick={() => setClicked(false)}>Bez fotky</button>
          <button onClick={() => setClicked(false)}>X</button>
        </div>
      )}

      <button
        onClick={() => setClicked(true)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "0 0 8px 8px",
          fontSize: "32px",
          cursor: "pointer",
          border: "none",
          backgroundColor: "#e0e0e0",
        }}
      >
        +
      </button>
    </>
  );
}

export default AddZavadaButton;
