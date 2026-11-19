import type { ChecklistZaznam } from "./types";

export type ChecklistSekce = "checklist" | "dokumentace";

export type ChecklistPolozka = {
  cislo: number;
  sekce: ChecklistSekce;
  nazev: string;
  vysvetlivka: string;
};

export const NAZVY_SEKCI: Record<ChecklistSekce, string> = {
  checklist:
    "VÝSLEDEK FYZICKÉ KONTROLY STAVBY A DODRŽOVÁNÍ POŽADAVKŮ PLÁNU BOZP",
  dokumentace: "Dokumentace a doklady stavby:",
};

export const CHECKLIST: ChecklistPolozka[] = [
  {
    cislo: 1,
    sekce: "checklist",
    nazev: "Kontrola způsobu zajištění staveniště/pracoviště",
    vysvetlivka:
      "(pohyb nepovolaných osob, oplocení 1,8 m, vjezd, vstup, zařízení staveniště, režimová opatření…)",
  },
  {
    cislo: 2,
    sekce: "checklist",
    nazev: "Kontrola označení stavby",
    vysvetlivka:
      "(název, bezp. značení, kontakty na dotčené osoby výstavby, oznámení o zahájení prací na OIP …)",
  },
  {
    cislo: 3,
    sekce: "checklist",
    nazev:
      "Kontrola způsobu prováděných pracovních postupů z hlediska zajištění BOZP a přijatých opatření k eliminaci bezpečnostních a zdravotních rizik:",
    vysvetlivka: "",
  },
  {
    cislo: 4,
    sekce: "checklist",
    nazev: "Kontrola bezpečného pohybu po staveništi",
    vysvetlivka:
      "(zajištění volné hrany pádu, výkopů proti pádu do hloubky, ohrožený prostor pod prací ve výšce…)",
  },
  {
    cislo: 5,
    sekce: "checklist",
    nazev: "Kontrola používání OOPP na staveništi",
    vysvetlivka: "",
  },
  {
    cislo: 6,
    sekce: "checklist",
    nazev: "Vizuální kontrola stavu technického vybavení",
    vysvetlivka:
      "(nářadí, mechanizace, dočasné stavební konstrukce, vázací prostředky, průkazy odborností…)",
  },
  {
    cislo: 7,
    sekce: "checklist",
    nazev: "Kontrola vybavení zařízení staveniště",
    vysvetlivka:
      "(dostupnost lékárničky, sociálního a hygienického zázemí, prostředků požární ochrany…)",
  },
  {
    cislo: 8,
    sekce: "checklist",
    nazev: "Dodržování pořádku na staveništi, nakládání s odpady a CHLS",
    vysvetlivka: "",
  },
  {
    cislo: 9,
    sekce: "checklist",
    nazev: "Ostatní",
    vysvetlivka: "",
  },
  {
    cislo: 10,
    sekce: "dokumentace",
    nazev:
      "Informování koordinátora BOZP zhotovitelem o zvolených pracovně-technologických postupech, o řešení rizik z nich vyplývajících a o změnách, které mají dopad do oblasti BOZP v průběhu stavby",
    vysvetlivka: "(dle § 16 písm. a) zákona č. 309/2006 Sb.)",
  },
  {
    cislo: 11,
    sekce: "dokumentace",
    nazev:
      "Informování koordinátora BOZP zhotovitelem o nástupu nových dodavatelů stavebních prací; aktuální seznam zhotovitelů",
    vysvetlivka: "(dle: § 16 písm. a) zákona č. 309/2006 Sb.)",
  },
  {
    cislo: 12,
    sekce: "dokumentace",
    nazev: "Vedení stavebního/montážního deníku",
    vysvetlivka: "",
  },
  {
    cislo: 13,
    sekce: "dokumentace",
    nazev:
      "Předložení aktuálního časového harmonogramu stavebních a montážních prací: ",
    vysvetlivka: "",
  },
  {
    cislo: 14,
    sekce: "dokumentace",
    nazev: "Ostatní: Plán BOZP",
    vysvetlivka: "",
  },
];

export const vytvorChecklist = (): ChecklistZaznam[] =>
  CHECKLIST.map((p) => ({
    cislo: p.cislo,
    stav: "nesoulad",
    poznamka: "",
    fotoIds: [],
  }));
