export type Zavada = {
  id: number;
  poradoveCislo: number;
  zdrojKontrola: number | null;
  typ: "predchozi" | "povinna" | "nova";
  povinnaIndex?: number | null;
  name: string;
  primaryDescription: string;
  secondaryDescription: string;
  fotoIds: number[];
  stav: "soulad" | "nesoulad" | "v_procesu" | "null";
};

export type ChecklistZaznam = {
  cislo: number;
  stav: Zavada["stav"];
  poznamka: string;
  fotoIds: number[];
};

export type Zapis = {
  id: number;
  poradoveCislo: number;
  datum: string;
  zavady: Zavada[];
  predlozeniRizik: boolean;
  predlozeniTP: boolean;
  cinnosti: string[];
  poznamky: string;
  checklist: ChecklistZaznam[];
};

export type Stavba = {
  id: number;
  jmeno: string;
  zhotovitel: string;
  adresa: string;
  status: "aktivní" | "ukončená";
  kontaktOsoba: string;
  kontaktTelefon: string;
  dnyKontroly: number[];
  zapisy: Zapis[];
  zhotovitele: Zhotovitel[];
};

export type Zhotovitel = {
  id: number;
  nazev: string;
  ic: string;
  kontaktOsoba?: string;
  kontaktTelefon?: string;
  kontaktMail?: string;
  predlozeniRizik: boolean;
  predlozeniTP: boolean;
};

export type Dodatky = {
  predlozeniRizik: boolean;
  predlozeniTP: boolean;
  cinnosti: string[];
  poznamky: string;
  zhotovitele: Zhotovitel[];
};

export type Foto = {
  id: number;
  url: string;
  porizeno: string;
  vyrazena: boolean;
};

export type CilFota = {
  klic: string;
  popis: string;
  kratce: string;
  skupina: "nova" | "predchozi" | "checklist";
  fotoIds: number[];
};
