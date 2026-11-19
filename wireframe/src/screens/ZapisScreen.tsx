// src/components/ZapisScreen.tsx
import HeaderStavby from "../components/HeaderStavby.tsx";
import SeznamZavad from "../components/SeznamZavad.tsx";
import { mockStavby } from "../mockdata.ts";
import { useParams, useNavigate, useOutlet } from "react-router-dom";
import { useState } from "react";
import type {
  Dodatky,
  Zavada,
  Foto,
  ChecklistZaznam,
  CilFota,
} from "../types.tsx";
import { Box, Tabs, Badge, Button } from "@radix-ui/themes";
import FotkyZalozka from "../components/FotkyZalozka.tsx";
import { CHECKLIST, vytvorChecklist } from "../checklist.tsx";
import ChecklistSeznam from "../components/ChecklistSeznam.tsx";
import { cisloZavady, popisPolozky, popisZavady } from "../popisy.tsx";

export type ZapisContext = {
  zavady: Zavada[];
  predchoziZavady: Zavada[];
  aktualniZavady: Zavada[];
  zmenitStav: (id: number, stav: Zavada["stav"]) => void;
  dalsiZavada: (fotoIds?: number[]) => Zavada;
  ulozitZavadu: (zavada: Zavada) => void;
  zvyraznitNeuplne: boolean;
  setZvyraznitNeuplne: (v: boolean) => void;
  smazatZavadu: (id: number) => void;
  dodatky: Dodatky;
  setDodatky: React.Dispatch<React.SetStateAction<Dodatky>>;
  fotky: Foto[];
  pridatFotky: (urls: string[]) => number[];
  checklist: ChecklistZaznam[];
  ulozitChecklist: (zaznam: ChecklistZaznam) => void;
};

function ZapisScreen() {
  const navigate = useNavigate();
  const { stavbaId } = useParams();
  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const posledniZapis = stavba.zapisy[stavba.zapisy.length - 1];
  const noveCisloZapisu = stavba.zapisy.length + 1;
  const [zvyraznitNeuplne, setZvyraznitNeuplne] = useState(false);

  const initialPredchoziZavady: Zavada[] = posledniZapis.zavady
    .filter(
      (z) =>
        z.typ !== "povinna" &&
        (z.stav === "nesoulad" || z.stav === "v_procesu"),
    )
    .map((z) => ({
      ...z,
      typ: "predchozi" as const,
      stav: "nesoulad" as const,
    }));

  const [predchoziZavady, setPredchoziZavady] = useState<Zavada[]>(
    initialPredchoziZavady,
  );
  const [aktualniZavady, setAktualniZavady] = useState<Zavada[]>([]);

  const [checklist, setChecklist] =
    useState<ChecklistZaznam[]>(vytvorChecklist);
  const zmenitStavChecklistu = (cislo: number, stav: Zavada["stav"]) =>
    setChecklist((prev) =>
      prev.map((z) => (z.cislo === cislo ? { ...z, stav } : z)),
    );
  const ulozitChecklist = (zaznam: ChecklistZaznam) =>
    setChecklist((prev) =>
      prev.map((z) => (z.cislo === zaznam.cislo ? zaznam : z)),
    );

  const [rozbaleneChecklist, setRozbaleneChecklist] = useState<number[]>([]);
  const prepnoutChecklist = (cislo: number) =>
    setRozbaleneChecklist((prev) =>
      prev.includes(cislo) ? prev.filter((i) => i !== cislo) : [...prev, cislo],
    );

  const handleStavChange = (
    setter: React.Dispatch<React.SetStateAction<Zavada[]>>,
    id: number,
    novyStav: Zavada["stav"],
  ) => {
    setter((prev) =>
      prev.map((z) => (z.id === id ? { ...z, stav: novyStav } : z)),
    );
  };

  const dalsiCislo =
    Math.max(
      0,
      ...stavba.zapisy
        .flatMap((zp) => zp.zavady)
        .filter((z) => z.typ !== "povinna")
        .map((z) => z.poradoveCislo),
      ...aktualniZavady.map((z) => z.poradoveCislo),
    ) + 1;

  const dalsiZavada = (fotoIds: number[] = []): Zavada => ({
    id:
      Math.max(
        0,
        ...posledniZapis.zavady.map((z) => z.id),
        ...aktualniZavady.map((z) => z.id),
      ) + 1,
    poradoveCislo: dalsiCislo,
    zdrojKontrola: noveCisloZapisu,
    typ: "nova",
    name: "",
    primaryDescription: "",
    secondaryDescription: "",
    fotoIds,
    stav: "nesoulad",
  });

  const ulozitZavadu = (zavada: Zavada) => {
    if (zavada.typ === "nova") {
      setAktualniZavady((prev) =>
        prev.some((z) => z.id === zavada.id)
          ? prev.map((z) => (z.id === zavada.id ? zavada : z))
          : [...prev, zavada],
      );
      return;
    }

    const upravit = (prev: Zavada[]) =>
      prev.map((z) =>
        z.id === zavada.id
          ? {
              ...z,
              name: zavada.name,
              primaryDescription: zavada.primaryDescription,
              secondaryDescription: zavada.secondaryDescription,
              fotoIds: zavada.fotoIds,
              stav: zavada.stav,
            }
          : z,
      );
    setPredchoziZavady(upravit);
  };

  const smazatZavadu = (id: number) => {
    setAktualniZavady((prev) => prev.filter((z) => z.id !== id));
  };

  const handlePridatZavadu = (urls: string[]) => {
    navigate(`/stavba/${stavbaId}/zapis/zavada/nova`, { state: { urls } });
  };

  const zmenitStav = (id: number, stav: Zavada["stav"]) => {
    for (const set of [setPredchoziZavady, setAktualniZavady]) {
      set((prev) => prev.map((z) => (z.id === id ? { ...z, stav } : z)));
    }
  };

  const pripravitSouhrn = () => {
    const nesouladPovinne = checklist.filter(
      (z) => z.stav === "nesoulad" || z.stav === "v_procesu",
    );
    setAktualniZavady((prev) => {
      const zbyle = prev.filter(
        (z) =>
          z.povinnaIndex == null ||
          nesouladPovinne.some((p) => p.cislo === z.povinnaIndex),
      );
      const uzPrevedene = new Set(zbyle.map((z) => z.povinnaIndex));

      let dalsiId =
        Math.max(
          0,
          ...posledniZapis.zavady.map((z) => z.id),
          ...zbyle.map((z) => z.id),
        ) + 1;
      let dalsiCislo =
        Math.max(
          0,
          ...stavba.zapisy
            .flatMap((zp) => zp.zavady)
            .filter((z) => z.typ !== "povinna")
            .map((z) => z.poradoveCislo),
          ...zbyle.map((z) => z.poradoveCislo),
        ) + 1;

      const nove: Zavada[] = nesouladPovinne
        .filter((p) => !uzPrevedene.has(p.cislo))
        .map((p) => {
          const polozka = CHECKLIST.find((c) => c.cislo === p.cislo);
          return {
            id: dalsiId++,
            poradoveCislo: dalsiCislo++,
            zdrojKontrola: noveCisloZapisu,
            typ: "nova" as const,
            povinnaIndex: p.cislo,
            name: p.poznamka.trim() || polozka?.nazev || "",
            primaryDescription: "",
            secondaryDescription: "",
            fotoIds: p.fotoIds,
            stav: p.stav,
          };
        });
      return [...zbyle, ...nove];
    });
    navigate(`/stavba/${stavbaId}/zapis/souhrn`);
  };

  const [dodatky, setDodatky] = useState<Dodatky>({
    predlozeniRizik: false,
    predlozeniTP: false,
    cinnosti: [],
    poznamky: "",
    zhotovitele: stavba.zhotovitele ?? [],
  });

  const [rozbalene, setRozbalene] = useState<number[]>([]);
  const [zalozka, setZalozka] = useState("predchozi");
  const prepnout = (id: number) =>
    setRozbalene((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const [fotky, setFotky] = useState<Foto[]>([]);
  const pridatFotky = (urls: string[]) => {
    const start = Math.max(0, ...fotky.map((f) => f.id)) + 1;
    const noveFotky = urls.map((url, i) => ({
      id: start + i,
      url,
      porizeno: new Date().toISOString(),
      vyrazena: false,
    }));
    setFotky((prev) => [...prev, ...noveFotky]);
    return noveFotky.map((f) => f.id);
  };
  const vyraditFoto = (id: number, vyrazena: boolean) =>
    setFotky((prev) => prev.map((f) => (f.id === id ? { ...f, vyrazena } : f)));
  const vsechnySetteryZavad = [setPredchoziZavady, setAktualniZavady];
  const upravIds = (ids: number[], fotoId: number, ano: boolean) =>
    ano ? [...new Set([...ids, fotoId])] : ids.filter((i) => i !== fotoId);

  const priraditFoto = (klic: string, fotoId: number, ano: boolean) => {
    const [typ, id] = klic.split(":");
    if (typ === "c") {
      setChecklist((prev) =>
        prev.map((c) =>
          c.cislo === Number(id)
            ? { ...c, fotoIds: upravIds(c.fotoIds, fotoId, ano) }
            : c,
        ),
      );
      return;
    }
    for (const set of [setPredchoziZavady, setAktualniZavady]) {
      set((prev) =>
        prev.map((z) =>
          z.id === Number(id)
            ? { ...z, fotoIds: upravIds(z.fotoIds, fotoId, ano) }
            : z,
        ),
      );
    }
  };
  const smazatFoto = (id: number) => {
    setFotky((prev) => prev.filter((f) => f.id !== id));
    setChecklist((prev) =>
      prev.map((c) => ({ ...c, fotoIds: c.fotoIds.filter((i) => i !== id) })),
    );
    for (const set of vsechnySetteryZavad) {
      set((prev) =>
        prev.map((z) => ({ ...z, fotoIds: z.fotoIds.filter((i) => i !== id) })),
      );
    }
  };

  const cislaFotek = (fotky: Foto[]) =>
    new Map(
      fotky
        .filter((f) => !f.vyrazena)
        .sort((a, b) => a.porizeno.localeCompare(b.porizeno))
        .map((f, i) => [f.id, i + 1] as const),
    );

  const cile: CilFota[] = [
    ...aktualniZavady.map((z) => ({
      klic: `z:${z.id}`,
      popis: popisZavady(z),
      kratce: cisloZavady(z),
      skupina: "nova" as const,
      fotoIds: z.fotoIds,
    })),
    ...predchoziZavady.map((z) => ({
      klic: `z:${z.id}`,
      popis: popisZavady(z),
      kratce: cisloZavady(z),
      skupina: "predchozi" as const,
      fotoIds: z.fotoIds,
    })),
    ...checklist.map((c) => ({
      klic: `c:${c.cislo}`,
      popis: popisPolozky(c.cislo),
      kratce: `${c.cislo}.`,
      skupina: "checklist" as const,
      fotoIds: c.fotoIds,
    })),
  ];

  const outlet = useOutlet({
    zavady: [...predchoziZavady, ...aktualniZavady],
    predchoziZavady,
    aktualniZavady,
    zmenitStav,
    dalsiZavada,
    ulozitZavadu,
    zvyraznitNeuplne,
    setZvyraznitNeuplne,
    smazatZavadu,
    dodatky,
    setDodatky,
    fotky,
    pridatFotky,
    checklist,
    ulozitChecklist,
  } satisfies ZapisContext);

  if (outlet) return outlet;

  return (
    <Tabs.Root
      value={zalozka}
      onValueChange={(v: string) => setZalozka(v)}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        px="4"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "var(--color-background)",
        }}
      >
        <HeaderStavby stavba={stavba} cisloZapisu={noveCisloZapisu} />
        <Tabs.List>
          <Tabs.Trigger value="predchozi">
            Předchozí{" "}
            <Badge color="red" ml="1">
              {predchoziZavady.filter((z) => z.stav !== "soulad").length}
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="checklist">
            Checklist{" "}
            <Badge color="orange" ml="1">
              {checklist.filter((z) => z.stav !== "soulad").length}
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="aktualni">
            Aktuální{" "}
            <Badge color="blue" ml="1">
              {aktualniZavady.length}
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="fotky">
            Fotky{" "}
            <Badge color="gray" ml="1">
              {fotky.filter((f) => !f.vyrazena).length}
            </Badge>
          </Tabs.Trigger>
        </Tabs.List>
      </Box>
      <Box style={{ flex: 1 }}>
        <Tabs.Content value="predchozi">
          <SeznamZavad
            zavady={predchoziZavady}
            rozbalene={rozbalene}
            onToggle={prepnout}
            onStavChange={(id, stav) =>
              handleStavChange(setPredchoziZavady, id, stav)
            }
            fotky={fotky}
          />
        </Tabs.Content>
        <Tabs.Content value="checklist">
          <ChecklistSeznam
            checklist={checklist}
            fotky={fotky}
            rozbalene={rozbaleneChecklist}
            onToggle={prepnoutChecklist}
            onStav={zmenitStavChecklistu}
          />
        </Tabs.Content>
        <Tabs.Content value="aktualni">
          <SeznamZavad
            zavady={aktualniZavady}
            rozbalene={rozbalene}
            onToggle={prepnout}
            onStavChange={(id, stav) =>
              handleStavChange(setAktualniZavady, id, stav)
            }
            onPridatZavadu={handlePridatZavadu}
            showAddButton
            fotky={fotky}
          />
        </Tabs.Content>
        <Tabs.Content value="fotky">
          <FotkyZalozka
            fotky={fotky}
            cile={cile}
            cisla={cislaFotek(fotky)}
            onPridat={pridatFotky}
            onVyrazena={vyraditFoto}
            onSmazat={smazatFoto}
            onPriradit={priraditFoto}
          />
        </Tabs.Content>
      </Box>
      <Box
        p="4"
        style={{
          position: "sticky",
          bottom: 0,
          zIndex: 10,
          backgroundColor: "var(--color-background)",
          borderTop: "1px solid var(--color-border)",
          paddingBottom: "max(16px, env(safe-area-inset-bottom))",
        }}
      >
        <Button size="4" style={{ width: "100%" }} onClick={pripravitSouhrn}>
          Pokračovat
        </Button>
      </Box>
    </Tabs.Root>
  );
}

export default ZapisScreen;
