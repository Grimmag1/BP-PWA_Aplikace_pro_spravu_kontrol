// src/components/ZapisScreen.tsx
import { useState } from "react";
import type { Stavba, Zavada } from "../types.tsx";
import HeaderStavby from "./HeaderStavby.tsx";
import SekceZavad from "./SekceZavad.tsx";

const mockStavba: Stavba = {
  id: 1,
  jmeno: "Stavba A",
  cisloKontroly: 5,
  datum: "01-10-2026",
};

const mockPredchoziZavady: Zavada[] = [
  {
    id: 1,
    poradoveCislo: 1,
    cisloKontroly: 4,
    name: "Zavada 1",
    primaryDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    secondaryDescription: "Zapažení není správně nainstalováno",
    foto: null,
    stav: "nesoulad",
  },
  {
    id: 2,
    poradoveCislo: 2,
    cisloKontroly: 2,
    name: "Zavada 2",
    primaryDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    secondaryDescription: "Pracovníci nejsou vybaveni ochrannými pomůckami",
    foto: null,
    stav: "nesoulad",
  },
];

const mockPovinneZavady: Zavada[] = [
  {
    id: 1,
    poradoveCislo: 1,
    cisloKontroly: 5,
    name: "Zavada 1",
    primaryDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    secondaryDescription: "Zapažení není správně nainstalováno",
    foto: null,
    stav: "nesoulad",
  },
  {
    id: 2,
    poradoveCislo: 2,
    cisloKontroly: 5,
    name: "Zavada 2",
    primaryDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    secondaryDescription: "Pracovníci nejsou vybaveni ochrannými pomůckami",
    foto: null,
    stav: "nesoulad",
  },
];

const mockAktualniZavady: Zavada[] = [
  {
    id: 1,
    poradoveCislo: 3,
    cisloKontroly: 5,
    name: "Zavada 1",
    primaryDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    secondaryDescription: "Oplocení je příliš nízké",
    foto: null,
    stav: "null",
  },
];

function ZapisScreen() {
  const [predchoziZavady] = useState<Zavada[]>(mockPredchoziZavady);
  const [povinneZavady] = useState<Zavada[]>(mockPovinneZavady);
  const [aktualniZavady] = useState<Zavada[]>(mockAktualniZavady);

  return (
    <div>
      <HeaderStavby stavba={mockStavba} />

      <SekceZavad
        nazev="Závady z předchozích kontrol"
        zavady={predchoziZavady}
      />
      <SekceZavad nazev="Povinné závady" zavady={povinneZavady} />
      <SekceZavad
        nazev="Závady z aktuální kontroly"
        zavady={aktualniZavady}
        showAddButton
      />
    </div>
  );
}

export default ZapisScreen;
