// src/components/HeaderStavby.tsx
import type { Stavba, Zapis } from "../types.tsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { cs } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function HeaderStavby({
  stavba,
  cisloZapisu,
}: {
  stavba: Stavba;
  cisloZapisu: Zapis["poradoveCislo"];
}) {
  const [datum, setDatum] = useState<Date>(new Date());
  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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

        <button
          onClick={() => navigate(`/stavba/${stavba.id}/info`)}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "6px",
            backgroundColor: "white",
            color: "black",
            border: "2px solid black",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          i
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          whiteSpace: "nowrap",
        }}
      >
        <p>Kontrola č. {cisloZapisu}</p>

        <DatePicker
          selected={datum}
          onChange={(datum: Date | null) => datum && setDatum(datum)}
          dateFormat="dd-mm-yyyy"
          portalId="root"
          withPortal
          locale={cs}
          customInput={
            <span style={{ cursor: "pointer" }}>
              {datum.toLocaleDateString("cs-CZ")}
            </span>
          }
        />
      </div>
    </div>
  );
}

export default HeaderStavby;
