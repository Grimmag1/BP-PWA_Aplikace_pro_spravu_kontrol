// src/components/HeaderStavby.tsx
import type { Stavba } from "../types.tsx";

function HeaderStavby({ stavba }: { stavba: Stavba }) {
  return (
    <div>
      <h1>{stavba.jmeno}</h1>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <p>Kontrola č. {stavba.cisloKontroly}</p>
        <p>{stavba.datum}</p>
      </div>
    </div>
  );
}

export default HeaderStavby;
