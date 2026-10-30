import type { Stavba, Zapis, Zavada } from "./types";

type Stav = Zavada["stav"];
type Bez = Omit<Zavada, "id">;

const POVINNE = [
  {
    name: "Kontrola BOZP dokumentace",
    popis: "Dokumentace BOZP je přítomna na stavbě.",
  },
  {
    name: "Kontrola vstupního školení",
    popis: "Pracovníci mají záznam o vstupním školení.",
  },
  {
    name: "Kontrola hasicích přístrojů",
    popis: "Hasicí přístroje jsou na místě a mají platnou revizi.",
  },
];

const VSE_OK: [Stav, Stav, Stav] = ["soulad", "soulad", "soulad"];

const povinne = (stavy: [Stav, Stav, Stav]): Bez[] =>
  POVINNE.map(
    (p, i): Bez => ({
      poradoveCislo: i + 1,
      zdrojKontrola: null,
      typ: "povinna",
      name: p.name,
      primaryDescription: p.popis,
      secondaryDescription: "",
      foto: [],
      stav: stavy[i],
    }),
  );

// Nová závada: cislo = číslování napříč stavbou, kontrola = zápis, ve kterém vznikla
const nova = (
  cislo: number,
  kontrola: number,
  name: string,
  popis: string,
  detail = "",
): Bez => ({
  poradoveCislo: cislo,
  zdrojKontrola: kontrola,
  typ: "nova",
  name,
  primaryDescription: popis,
  secondaryDescription: detail,
  foto: [],
  stav: "nesoulad",
});

// Přenos nevyřešené závady do dalšího zápisu (Y/X zůstává, mění se stav)
const prenos = (z: Bez, stav: Stav): Bez => ({ ...z, typ: "predchozi", stav });

const zapis = (cislo: number, datum: string, zavady: Bez[]): Zapis => ({
  id: cislo,
  poradoveCislo: cislo,
  datum,
  zavady: zavady.map((z, i) => ({ ...z, id: i + 1 })),
});

// ───────── Stavba A ─────────
const aZapazeni = nova(
  1,
  1,
  "Chybí zapažení výkopu",
  "Výkop v severní části stavby není řádně zapažen.",
  "Hloubka výkopu přesahuje 1,5 m bez zajištění.",
);
const aVesty = nova(
  2,
  1,
  "Pracovníci bez reflexních vest",
  "Část pracovníků nepracuje v reflexních vestách.",
  "Týká se 3 pracovníků na jižní straně.",
);
const aHasici = nova(
  3,
  1,
  "Prošlá revize hasicího přístroje",
  "Jeden hasicí přístroj má prošlou revizi.",
); // z povinné 3)
const aOploceni = nova(
  4,
  2,
  "Nízké oplocení",
  "Oplocení staveniště nedosahuje předepsané výšky 1,8 m.",
  "Změřeno na třech místech, průměrná výška 1,4 m.",
);
const aVedeni = nova(
  5,
  2,
  "Odhalené elektrické vedení",
  "Elektrické vedení není chráněno před mechanickým poškozením.",
);
const aSkoleni = nova(
  6,
  3,
  "Chybí záznam o školení",
  "U dvou pracovníků chybí záznam o vstupním školení.",
); // z povinné 2)
const aVyska = nova(
  7,
  3,
  "Nezajištěná práce ve výšce",
  "Pracovník pracuje ve výšce bez záchytného postroje.",
  "Výška přesahuje 1,5 m, postroj není použit.",
);
const aLeseni = nova(
  8,
  3,
  "Poškozené lešení",
  "Lešení v západní části má poškozené spojky.",
  "Celkem 4 poškozené spojky na 2. patře.",
);

// ───────── Stavba B ─────────
const bDok = nova(
  1,
  1,
  "Chybí BOZP dokumentace",
  "Dokumentace BOZP na stavbě chybí.",
); // z povinné 1)
const bZabradli = nova(
  2,
  1,
  "Chybí ochranné zábradlí",
  "Zábradlí chybí na východním schodišti.",
);
const bSklad = nova(
  3,
  1,
  "Nevhodné skladování materiálu",
  "Materiál je skladován v průchodové trase.",
);
const bPrilba = nova(
  4,
  2,
  "Poškozená přilba pracovníka",
  "Pracovník č. 3 má prasklou přilbu.",
);
const bJamy = nova(
  5,
  2,
  "Nezakryté jámy",
  "Jámy v severní části nejsou zakryty ani ohrazeny.",
);
const bHasici = nova(
  6,
  3,
  "Prošlá revize hasicího přístroje",
  "Jeden přístroj má prošlou revizi.",
); // z povinné 3)
const bOsvetleni = nova(
  7,
  3,
  "Chybí osvětlení pracoviště",
  "Pracoviště v podzemní části nemá dostatečné osvětlení.",
);
const bZony = nova(
  8,
  3,
  "Nevyznačené nebezpečné zóny",
  "Zóny s pohybem těžké techniky nejsou vyznačeny.",
);

// ───────── Stavba C (ukončená) ─────────
const cDok = nova(1, 1, "Chybí BOZP dokumentace", "Dokumentace BOZP chybí."); // z povinné 1)
const cHasici = nova(
  2,
  1,
  "Chybí hasicí přístroje",
  "Na staveništi nejsou hasicí přístroje.",
); // z povinné 3)
const cOop = nova(
  3,
  1,
  "Chybí osobní ochranné prostředky",
  "Pracovníci nemají přiděleny OOP.",
);
const cKomunikace = nova(
  4,
  1,
  "Poškozené komunikace",
  "Staveniště nemá bezpečné komunikace pro pěší.",
);
const cZnaceni = nova(
  5,
  2,
  "Nedostatečné značení",
  "Výstražné značky nejsou umístěny dle předpisů.",
);

// ───────── Stavba D ─────────
const dVykop = nova(
  1,
  1,
  "Nezajištěný výkop",
  "Výkop na jižní straně není ohrazen.",
  "Výkop je hluboký 2 m bez ohrazení.",
);
const dZnaceni = nova(
  2,
  1,
  "Chybí výstražné značení",
  "Na vjezdu chybí výstražné cedule.",
);
const dHasici = nova(
  3,
  2,
  "Chybějící hasicí přístroj",
  "Na staveništi chybí jeden hasicí přístroj.",
); // z povinné 3)
const dLeseni = nova(
  4,
  2,
  "Poškozené lešení",
  "Lešení na severní straně má uvolněné příčky.",
  "Zjištěno 6 uvolněných příček.",
);
const dOsvetleni = nova(
  5,
  3,
  "Nedostatečné osvětlení",
  "Osvětlení v podzemní části je nedostatečné.",
);

// ───────── Stavba E ─────────
const eDok = nova(1, 1, "Chybí BOZP dokumentace", "Dokumentace BOZP chybí."); // z povinné 1)
const ePrilby = nova(
  2,
  1,
  "Pracovníci bez přileb",
  "Tři pracovníci pracují bez ochranných přileb.",
);
const eUnik = nova(
  3,
  1,
  "Nevyznačené únikové cesty",
  "Únikové cesty nejsou označeny.",
);
const eLekarnicka = nova(
  4,
  1,
  "Chybí lékárnička",
  "Na pracovišti chybí lékárnička první pomoci.",
);
const eJerab = nova(
  5,
  2,
  "Nestabilní jeřáb",
  "Věžový jeřáb vykazuje nestabilitu základů.",
  "Základová deska je popraskána.",
);
const eChemie = nova(
  6,
  3,
  "Nevhodné uskladnění chemikálií",
  "Chemikálie nejsou uskladněny dle předpisů.",
);

// ───────── Stavba F ─────────
const fSkoleni = nova(
  1,
  1,
  "Chybí záznam o školení",
  "Školení neproběhlo u 2 pracovníků.",
); // z povinné 2)
const fSit = nova(
  2,
  1,
  "Chybí záchytná síť",
  "Na lešení chybí záchytná síť.",
  "Výška lešení je 8 m.",
);
const fPomucky = nova(
  3,
  1,
  "Poškozené ochranné pomůcky",
  "Část ochranných pomůcek je poškozena.",
);
const fUklid = nova(
  4,
  2,
  "Neuklizené pracoviště",
  "Na pracovišti leží nevyužitý materiál.",
);
const fVykopy = nova(
  5,
  2,
  "Chybí ochrana výkopů",
  "Výkopy podél budovy nejsou chráněny.",
);
const fZabradli = nova(
  6,
  3,
  "Chybí zábradlí na schodišti",
  "Dočasné schodiště nemá zábradlí.",
);

export const mockStavby: Stavba[] = [
  {
    id: 1,
    jmeno: "Stavba A",
    zhotovitel: "Firma XY s.r.o.",
    adresa: "Brno, Moravské náměstí 1",
    status: "aktivní",
    kontaktOsoba: "Jan Novák",
    kontaktTelefon: "+420 731 123 456",
    dnyKontroly: [0, 3],
    zapisy: [
      zapis(1, "01-08-2026", [
        ...povinne(["soulad", "soulad", "nesoulad"]),
        aZapazeni,
        aVesty,
        aHasici,
      ]),
      zapis(2, "01-09-2026", [
        prenos(aZapazeni, "nesoulad"),
        prenos(aVesty, "v_procesu"),
        prenos(aHasici, "soulad"),
        ...povinne(VSE_OK),
        aOploceni,
        aVedeni,
      ]),
      zapis(3, "01-10-2026", [
        prenos(aZapazeni, "soulad"),
        prenos(aVesty, "soulad"),
        prenos(aOploceni, "nesoulad"),
        prenos(aVedeni, "v_procesu"),
        ...povinne(["soulad", "nesoulad", "soulad"]),
        aSkoleni,
        aVyska,
        aLeseni,
      ]),
    ],
  },
  {
    id: 2,
    jmeno: "Stavba B",
    zhotovitel: "Stavby Novák a.s.",
    adresa: "Praha, Václavské náměstí 5",
    status: "aktivní",
    kontaktOsoba: "Marie Svobodová",
    kontaktTelefon: "+420 602 987 654",
    dnyKontroly: [1],
    zapisy: [
      zapis(1, "10-08-2026", [
        ...povinne(["nesoulad", "soulad", "soulad"]),
        bDok,
        bZabradli,
        bSklad,
      ]),
      zapis(2, "10-09-2026", [
        prenos(bDok, "soulad"),
        prenos(bZabradli, "nesoulad"),
        prenos(bSklad, "v_procesu"),
        ...povinne(VSE_OK),
        bPrilba,
        bJamy,
      ]),
      zapis(3, "10-10-2026", [
        prenos(bZabradli, "soulad"),
        prenos(bSklad, "soulad"),
        prenos(bPrilba, "nesoulad"),
        prenos(bJamy, "v_procesu"),
        ...povinne(["soulad", "soulad", "nesoulad"]),
        bHasici,
        bOsvetleni,
        bZony,
      ]),
    ],
  },
  {
    id: 3,
    jmeno: "Stavba C",
    zhotovitel: "Build Pro s.r.o.",
    adresa: "Ostrava, Náměstí Republiky 3",
    status: "ukončená",
    kontaktOsoba: "Petr Dvořák",
    kontaktTelefon: "+420 777 456 789",
    dnyKontroly: [2, 4],
    zapisy: [
      zapis(1, "01-05-2026", [
        ...povinne(["nesoulad", "soulad", "nesoulad"]),
        cDok,
        cHasici,
        cOop,
        cKomunikace,
      ]),
      zapis(2, "01-06-2026", [
        prenos(cDok, "soulad"),
        prenos(cHasici, "soulad"),
        prenos(cOop, "soulad"),
        prenos(cKomunikace, "nesoulad"),
        ...povinne(VSE_OK),
        cZnaceni,
      ]),
      zapis(3, "01-07-2026", [
        prenos(cKomunikace, "soulad"),
        prenos(cZnaceni, "soulad"),
        ...povinne(VSE_OK),
      ]),
    ],
  },
  {
    id: 4,
    jmeno: "Stavba D",
    zhotovitel: "Konstrukt a.s.",
    adresa: "Brno, Veveří 15",
    status: "aktivní",
    kontaktOsoba: "Tomáš Procházka",
    kontaktTelefon: "+420 724 321 987",
    dnyKontroly: [2],
    zapisy: [
      zapis(1, "15-09-2026", [...povinne(VSE_OK), dVykop, dZnaceni]),
      zapis(2, "22-09-2026", [
        prenos(dVykop, "v_procesu"),
        prenos(dZnaceni, "soulad"),
        ...povinne(["soulad", "soulad", "nesoulad"]),
        dHasici,
        dLeseni,
      ]),
      zapis(3, "29-09-2026", [
        prenos(dVykop, "soulad"),
        prenos(dHasici, "soulad"),
        prenos(dLeseni, "nesoulad"),
        ...povinne(VSE_OK),
        dOsvetleni,
      ]),
    ],
  },
  {
    id: 5,
    jmeno: "Stavba E",
    zhotovitel: "Pozemní stavby s.r.o.",
    adresa: "Olomouc, Horní náměstí 8",
    status: "aktivní",
    kontaktOsoba: "Lucie Marková",
    kontaktTelefon: "+420 606 555 444",
    dnyKontroly: [0, 2, 4],
    zapisy: [
      zapis(1, "01-10-2026", [
        ...povinne(["nesoulad", "soulad", "soulad"]),
        eDok,
        ePrilby,
        eUnik,
        eLekarnicka,
      ]),
      zapis(2, "08-10-2026", [
        prenos(eDok, "soulad"),
        prenos(ePrilby, "soulad"),
        prenos(eUnik, "nesoulad"),
        prenos(eLekarnicka, "soulad"),
        ...povinne(VSE_OK),
        eJerab,
      ]),
      zapis(3, "15-10-2026", [
        prenos(eUnik, "soulad"),
        prenos(eJerab, "v_procesu"),
        ...povinne(VSE_OK),
        eChemie,
      ]),
    ],
  },
  {
    id: 6,
    jmeno: "Stavba F",
    zhotovitel: "Inženýrské stavby a.s.",
    adresa: "Zlín, náměstí Míru 12",
    status: "aktivní",
    kontaktOsoba: "Pavel Kratochvíl",
    kontaktTelefon: "+420 739 888 777",
    dnyKontroly: [3],
    zapisy: [
      zapis(1, "05-10-2026", [
        ...povinne(["soulad", "nesoulad", "soulad"]),
        fSkoleni,
        fSit,
        fPomucky,
      ]),
      zapis(2, "12-10-2026", [
        prenos(fSkoleni, "soulad"),
        prenos(fSit, "nesoulad"),
        prenos(fPomucky, "soulad"),
        ...povinne(VSE_OK),
        fUklid,
        fVykopy,
      ]),
      zapis(3, "19-10-2026", [
        prenos(fSit, "soulad"),
        prenos(fUklid, "nesoulad"),
        prenos(fVykopy, "soulad"),
        ...povinne(VSE_OK),
        fZabradli,
      ]),
    ],
  },
];
