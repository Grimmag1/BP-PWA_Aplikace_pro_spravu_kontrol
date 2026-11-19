import { useRef, useState } from "react";
import type { CilFota, Foto } from "../types";
import {
  Flex,
  Button,
  SegmentedControl,
  Text,
  Box,
  Badge,
} from "@radix-ui/themes";
import { CameraIcon, ImageIcon, Link2Icon } from "@radix-ui/react-icons";
import FotoProhlizec from "./FotoProhlizec.tsx";

type Filtr = "vse" | "prirazene" | "neprirazene" | "vyrazene";

const prazdnaZprava: Record<Filtr, string> = {
  vse: "Žádné fotky",
  prirazene: "Žádné přiřazené fotky",
  neprirazene: "Žádné nepřiřazené fotky",
  vyrazene: "Žádné vyřazené fotky",
};

function FotkyZalozka({
  fotky,
  cile,
  cisla,
  onPridat,
  onVyrazena,
  onSmazat,
  onPriradit,
}: {
  fotky: Foto[];
  cile: CilFota[];
  cisla: Map<number, number>;
  onPridat: (urls: string[]) => void;
  onVyrazena: (id: number, vyrazena: boolean) => void;
  onSmazat: (id: number) => void;
  onPriradit: (klic: string, fotoId: number, ano: boolean) => void;
}) {
  const galerieRef = useRef<HTMLInputElement>(null);
  const kameraRef = useRef<HTMLInputElement>(null);
  const [filtr, setFiltr] = useState<Filtr>("vse");

  const [prohlizec, setProhlizec] = useState<{
    fronta: number[];
    startId: number;
  } | null>(null);

  const pouzite = (fotoId: number) =>
    cile.filter((c) => c.fotoIds.includes(fotoId));
  const prirazene = fotky.filter(
    (f) => !f.vyrazena && pouzite(f.id).length > 0,
  );
  const neprirazene = fotky.filter(
    (f) => !f.vyrazena && pouzite(f.id).length === 0,
  );
  const vyrazene = fotky.filter((f) => f.vyrazena);
  const zobrazene =
    filtr === "prirazene"
      ? prirazene
      : filtr === "neprirazene"
        ? neprirazene
        : filtr === "vyrazene"
          ? vyrazene
          : fotky;

  const handleVyber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soubory = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (soubory.length === 0) return;
    onPridat(soubory.map((s) => URL.createObjectURL(s)));
  };

  const odpovida = (f: Foto) =>
    filtr === "vse"
      ? true
      : filtr === "prirazene"
        ? !f.vyrazena && pouzite(f.id).length > 0
        : filtr === "neprirazene"
          ? !f.vyrazena && pouzite(f.id).length === 0
          : f.vyrazena;

  return (
    <Flex direction="column" gap="3" p="4">
      <input
        ref={galerieRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleVyber}
        style={{ display: "none" }}
      />
      <input
        ref={kameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleVyber}
        style={{ display: "none" }}
      />

      <Flex gap="2">
        <Button
          variant="soft"
          style={{ flex: 1 }}
          onClick={() => kameraRef.current?.click()}
        >
          <CameraIcon /> Vyfotit
        </Button>
        <Button
          variant="soft"
          style={{ flex: 1 }}
          onClick={() => galerieRef.current?.click()}
        >
          <ImageIcon /> Z galerie
        </Button>
      </Flex>

      <SegmentedControl.Root
        value={filtr}
        onValueChange={(v: string) => setFiltr(v as Filtr)}
        style={{ width: "100%" }}
      >
        <SegmentedControl.Item value="vse">
          Vše ({fotky.length})
        </SegmentedControl.Item>
        <SegmentedControl.Item value="prirazene">
          Přiřazené ({prirazene.length})
        </SegmentedControl.Item>
        <SegmentedControl.Item value="neprirazene">
          Nepřiřazené ({neprirazene.length})
        </SegmentedControl.Item>
        <SegmentedControl.Item value="vyrazene">
          Vyřazené ({vyrazene.length})
        </SegmentedControl.Item>
      </SegmentedControl.Root>

      {zobrazene.length === 0 && (
        <Text align="center" color="gray" size="2" py="4">
          <em>{prazdnaZprava[filtr]}</em>
        </Text>
      )}

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
          gap: "8px",
        }}
      >
        {zobrazene.map((f) => {
          const pocet = pouzite(f.id).length;
          return (
            <Box
              key={f.id}
              onClick={() =>
                setProhlizec({
                  fronta: zobrazene.map((x) => x.id),
                  startId: f.id,
                })
              }
              style={{
                position: "relative",
                aspectRation: "1",
                cursor: "pointer",
              }}
            >
              <img
                src={f.url}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "var(--radius-3)",
                  opacity: f.vyrazena ? 0.35 : 1,
                  filter: f.vyrazena ? "grayscale(1)" : undefined,
                }}
              />
              {!f.vyrazena && (
                <Badge
                  size="2"
                  style={{
                    position: "absolute",
                    top: 4,
                    left: 4,
                  }}
                >
                  {cisla.get(f.id)}
                </Badge>
              )}
              {pocet > 0 && (
                <Badge
                  size="1"
                  color="gray"
                  variant="solid"
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                  }}
                >
                  <Link2Icon />
                  {pocet}
                </Badge>
              )}
            </Box>
          );
        })}
      </Box>
      {prohlizec && (
        <FotoProhlizec
          fotky={fotky}
          cile={cile}
          cisla={cisla}
          fronta={prohlizec.fronta}
          startId={prohlizec.startId}
          odpovida={odpovida}
          onVyrazena={onVyrazena}
          onSmazat={onSmazat}
          onPriradit={onPriradit}
          onZavrit={() => setProhlizec(null)}
        />
      )}
    </Flex>
  );
}

export default FotkyZalozka;
