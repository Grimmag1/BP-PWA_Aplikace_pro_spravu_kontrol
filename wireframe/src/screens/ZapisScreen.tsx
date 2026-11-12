// src/components/ZapisScreen.tsx
import HeaderStavby from "../components/HeaderStavby.tsx";
import SeznamZavad from "../components/SeznamZavad.tsx";
import { mockStavby } from "../mockdata.ts";
import { useParams, useNavigate, useOutlet } from "react-router-dom";
import { useState } from "react";
import type { Dodatky, Zavada, Foto } from "../types.tsx";
import { Box, Tabs, Badge, Button } from "@radix-ui/themes";

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

  const initialPovinneZavady: Zavada[] = posledniZapis.zavady
    .filter((z) => z.typ === "povinna")
    .map((z) => ({ ...z, stav: "soulad" as const }));

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
    setPovinneZavady(upravit);
  };

  const smazatZavadu = (id: number) => {
    setAktualniZavady((prev) => prev.filter((z) => z.id !== id));
  };

  const handlePridatZavadu = (urls: string[]) => {
    const fotoIds = pridatFotky(urls);
    navigate(`/stavba/${stavbaId}/zapis/zavada/nova`, { state: { fotoIds } });
  };

  const zmenitStav = (id: number, stav: Zavada["stav"]) => {
    for (const set of [
      setPredchoziZavady,
      setPovinneZavady,
      setAktualniZavady,
    ]) {
      set((prev) => prev.map((z) => (z.id === id ? { ...z, stav } : z)));
    }
  };

  const pripravitSouhrn = () => {
    const nesouladPovinne = povinneZavady.filter(
      (z) => z.stav === "nesoulad" || z.stav === "v_procesu",
    );
    setAktualniZavady((prev) => {
      const zbyle = prev.filter(
        (z) =>
          z.povinnaIndex == null ||
          nesouladPovinne.some((p) => p.poradoveCislo === z.povinnaIndex),
      );
      const uzPrevedene = new Set(zbyle.map((z) => z.povinnaIndex));

      let dalsiId =
        Math.max(
          0,
          ...[...predchoziZavady, ...povinneZavady, ...zbyle].map((z) => z.id),
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
        .filter((p) => !uzPrevedene.has(p.poradoveCislo))
        .map((p) => ({
          id: dalsiId++,
          poradoveCislo: dalsiCislo++,
          zdrojKontrola: noveCisloZapisu,
          typ: "nova" as const,
          povinnaIndex: p.poradoveCislo,
          name: p.name,
          primaryDescription: p.primaryDescription,
          secondaryDescription: p.secondaryDescription,
          fotoIds: p.fotoIds,
          stav: p.stav,
        }));
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

  const outlet = useOutlet({
    zavady: [...predchoziZavady, ...povinneZavady, ...aktualniZavady],
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
              {predchoziZavady.length}
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="povinne">
            Checklist{" "}
            <Badge color="orange" ml="1">
              {povinneZavady.length}
            </Badge>
          </Tabs.Trigger>
          <Tabs.Trigger value="aktualni">
            Aktuální{" "}
            <Badge color="blue" ml="1">
              {aktualniZavady.length}
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
        <Tabs.Content value="povinne">
          <SeznamZavad
            zavady={povinneZavady}
            rozbalene={rozbalene}
            onToggle={prepnout}
            onStavChange={(id, stav) =>
              handleStavChange(setPovinneZavady, id, stav)
            }
            fotky={fotky}
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
