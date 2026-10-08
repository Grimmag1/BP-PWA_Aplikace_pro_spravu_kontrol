export type Zavada = {
  id: number;
  poradoveCislo: number;
  cisloKontroly: number;
  name: string;
  primaryDescription: string;
  secondaryDescription: string;
  foto: string | null;
  stav: "soulad" | "nesoulad" | "v_procesu" | "null";
};

export type Stavba = {
  id: number;
  jmeno: string;
  cisloKontroly: number;
  datum: string;
};
