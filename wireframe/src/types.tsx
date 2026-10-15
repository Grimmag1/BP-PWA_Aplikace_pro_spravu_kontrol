export type Zavada = {
  id: number;
  poradoveCislo: number;
  zdrojKontrola: number | null;
  typ: "predchozi" | "povinna" | "nova";
  name: string;
  primaryDescription: string;
  secondaryDescription: string;
  foto: string | null;
  stav: "soulad" | "nesoulad" | "v_procesu" | "null";
};

export type Zapis = {
  id: number;
  poradoveCislo: number;
  datum: string;
  zavady: Zavada[];
};

export type Stavba = {
  id: number;
  jmeno: string;
  zhotovitel: string;
  adresa: string;
  status: "aktivní" | "ukončená";
  zapisy: Zapis[];
};
