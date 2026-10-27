// src/components/ZapisScreen.tsx
import HeaderStavby from "../components/HeaderStavby.tsx";
import SekceZavad from "../components/SekceZavad.tsx";
import { mockStavby } from "../mockdata.ts";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import type { Zavada } from "../types.tsx";

export type ZapisContext = {
  aktualniZavady: Zavada[];
  dalsiZavada: () => Zavada;
  ulozitZavadu: (zavada: Zavada) => void;
};

function ZapisScreen() {
  const navigate = useNavigate();
  const { stavbaId } = useParams();
  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const posledniZapis = stavba.zapisy[stavba.zapisy.length - 1];
  const noveCisloZapisu = stavba.zapisy.length + 1;

  const initialPredchoziZavady: Zavada[] = posledniZapis.zavady
    .filter((z) => z.stav === "nesoulad" || z.stav === "v_procesu")
    .map((z) => ({
      ...z,
      typ: "predchozi" as const,
      stav: "nesoulad" as const,
      zdrojKontrola: z.zdrojKontrola ?? posledniZapis.poradoveCislo,
    }));

  const initialPovinneZavady: Zavada[] = posledniZapis.zavady
    .filter((z) => z.typ === "povinna")
    .map((z) => ({ ...z, stav: "nesoulad" as const }));

  const [predchoziZavady, setPredchoziZavady] = useState<Zavada[]>(
    initialPredchoziZavady,
  );
  const [povinneZavady, setPovinneZavady] =
    useState<Zavada[]>(initialPovinneZavady);
  const [aktualniZavady, setAktualniZavady] = useState<Zavada[]>([]);

  const handleStavChange = (
    setter: React.Dispatch<React.SetStateAction<Zavada[]>>,
    id: number,
    novyStav: Zavada["stav"],
  ) => {
    setter((prev) =>
      prev.map((z) => (z.id === id ? { ...z, stav: novyStav } : z)),
    );
  };

  const dalsiZavada = (): Zavada => ({
    id:
      Math.max(
        0,
        ...posledniZapis.zavady.map((z) => z.id),
        ...aktualniZavady.map((z) => z.id),
      ) + 1,
    poradoveCislo: povinneZavady.length + aktualniZavady.length + 1,
    zdrojKontrola: null,
    typ: "nova",
    name: "",
    primaryDescription: "",
    secondaryDescription: "",
    foto: null,
    stav: "nesoulad",
  });

  const ulozitZavadu = (zavada: Zavada) => {
    setAktualniZavady((prev) =>
      prev.some((z) => z.id === zavada.id)
        ? prev.map((z) => (z.id === zavada.id ? zavada : z))
        : [...prev, zavada],
    );
  };

  const handlePridatZavadu = () => {
    navigate(`/stavba/${stavbaId}/zapis/zavada/nova`);
  };
  return (
    <div>
      <HeaderStavby stavba={stavba} cisloZapisu={noveCisloZapisu} />
      <SekceZavad
        nazev="Závady z předchozích kontrol"
        zavady={predchoziZavady}
        onStavChange={(id, stav) =>
          handleStavChange(setPredchoziZavady, id, stav)
        }
      />
      <SekceZavad
        nazev="Povinné závady"
        zavady={povinneZavady}
        onStavChange={(id, stav) =>
          handleStavChange(setPovinneZavady, id, stav)
        }
      />
      <SekceZavad
        nazev="Závady z aktuální kontroly"
        zavady={aktualniZavady}
        onStavChange={(id, stav) =>
          handleStavChange(setAktualniZavady, id, stav)
        }
        onPridatZavadu={handlePridatZavadu}
        showAddButton
      />
      <Outlet
        context={
          { aktualniZavady, dalsiZavada, ulozitZavadu } satisfies ZapisContext
        }
      />
    </div>
  );
}

export default ZapisScreen;
