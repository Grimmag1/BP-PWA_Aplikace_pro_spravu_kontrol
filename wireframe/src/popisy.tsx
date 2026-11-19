import { CHECKLIST } from "./checklist.tsx";
import type { Zavada } from "./types.tsx";

export const cisloZavady = (z: Zavada) =>
  z.povinnaIndex != null
    ? `Ad ${z.povinnaIndex}) ${z.poradoveCislo}/${z.zdrojKontrola}`
    : `${z.poradoveCislo}/${z.zdrojKontrola}`;

export const popisZavady = (z: Zavada) =>
  `${cisloZavady(z)} ${z.name || "(bez názvu)"}`;

export const popisPolozky = (cislo: number) =>
  `${cislo}. ${CHECKLIST.find((c) => c.cislo === cislo)?.nazev ?? ""}`;
