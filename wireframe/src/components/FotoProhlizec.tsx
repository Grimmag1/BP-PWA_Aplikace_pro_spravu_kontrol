import { useRef, useState } from "react";
import {
  AlertDialog,
  Button,
  Checkbox,
  Dialog,
  Flex,
  IconButton,
  Switch,
  Text,
} from "@radix-ui/themes";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import type { Foto, Zavada } from "../types.tsx";

function FotoProhlizec({
  fotky,
  zavady,
  cisla,
  fronta,
  startId,
  odpovida,
  onVyrazena,
  onSmazat,
  onPriradit,
  onZavrit,
}: {
  fotky: Foto[];
  zavady: Zavada[];
  cisla: Map<number, number>;
  fronta: number[];
  startId: number;
  odpovida: (f: Foto) => boolean;
  onVyrazena: (id: number, vyrazena: boolean) => void;
  onSmazat: (id: number) => void;
  onPriradit: (zavadaId: number, fotoId: number, ano: boolean) => void;
  onZavrit: () => void;
}) {
  const [aktualniId, setAktualniId] = useState(startId);
  const dotykX = useRef<number | null>(null);

  const zive = fronta.filter((id) => fotky.some((f) => f.id === id));
  const idx = zive.indexOf(aktualniId);
  const foto = fotky.find((f) => f.id === aktualniId);

  const najdi = (smer: 1 | -1): number | null => {
    for (let i = idx + smer; i >= 0 && i < zive.length; i += smer) {
      const f = fotky.find((x) => x.id === zive[i]);
      if (f && odpovida(f)) return f.id;
    }
    return null;
  };
  const dalsi = najdi(1);
  const predchozi = najdi(-1);
  const jdi = (id: number | null) => id !== null && setAktualniId(id);

  if (!foto) return null;

  const popisZavady = (z: Zavada) =>
    `${z.poradoveCislo}${z.typ === "povinna" ? ")" : `/${z.zdrojKontrola}`} ${z.name || "(bez názvu)"}`;

  const pouzitoU = zavady.filter((z) => z.fotoIds.includes(foto.id)).length;

  const smazat = () => {
    const cil = dalsi ?? predchozi;
    onSmazat(foto.id);
    if (cil === null) onZavrit();
    else setAktualniId(cil);
  };

  return (
    <Dialog.Root open onOpenChange={(o: boolean) => !o && onZavrit()}>
      <Dialog.Content
        maxWidth="1200px"
        aria-describedby={undefined}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "ArrowRight") jdi(dalsi);
          if (e.key === "ArrowLeft") jdi(predchozi);
        }}
        style={{
          padding: 0,
          height: "90dvh",
          maxHeight: "90dvh",
          overflow: "hidden",
        }}
      >
        <Flex
          direction={{ initial: "column", md: "row" }}
          style={{ height: "100%" }}
        >
          <Flex
            direction="column"
            style={{ flex: 1, minHeight: 0, background: "black" }}
          >
            <Flex justify="between" align="center" p="3">
              <Dialog.Title size="3" style={{ margin: 0, color: "white" }}>
                {foto.vyrazena
                  ? "Vyřazená fotka"
                  : `Foto č. ${cisla.get(foto.id)}`}
                <Text
                  size="2"
                  style={{ color: "var(--gray-9)", marginLeft: 8 }}
                >
                  {idx + 1} / {zive.length}
                </Text>
              </Dialog.Title>
              <Dialog.Close>
                <IconButton variant="ghost" color="gray" aria-label="Zavřít">
                  <Cross2Icon />
                </IconButton>
              </Dialog.Close>
            </Flex>

            <div
              style={{ flex: 1, minHeight: 0, position: "relative" }}
              onTouchStart={(e) => {
                dotykX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (dotykX.current === null) return;
                const dx = e.changedTouches[0].clientX - dotykX.current;
                dotykX.current = null;
                if (Math.abs(dx) > 50) jdi(dx < 0 ? dalsi : predchozi);
              }}
            >
              <img
                src={foto.url}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  opacity: foto.vyrazena ? 0.45 : 1,
                  filter: foto.vyrazena ? "grayscale(1)" : undefined,
                }}
              />
              <IconButton
                variant="soft"
                color="gray"
                radius="full"
                size="3"
                disabled={predchozi === null}
                aria-label="Předchozí"
                onClick={() => jdi(predchozi)}
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                variant="soft"
                color="gray"
                radius="full"
                size="3"
                disabled={dalsi === null}
                aria-label="Další"
                onClick={() => jdi(dalsi)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </div>
          </Flex>

          <Flex
            direction="column"
            gap="3"
            p="4"
            width={{ initial: "100%", md: "340px" }}
            maxHeight={{ initial: "45%", md: "100%" }}
            style={{ overflowY: "auto", flexShrink: 0 }}
          >
            <Text as="label" size="2">
              <Flex gap="2" align="center">
                <Switch
                  checked={foto.vyrazena}
                  onCheckedChange={(v: boolean) => onVyrazena(foto.id, v)}
                />
                Nepovedená, nezahrnout do PDF
              </Flex>
            </Text>

            <Text size="2" weight="bold">
              Použito u závad
            </Text>
            <Flex direction="column" gap="2">
              {zavady.map((z) => (
                <Text as="label" size="2" key={z.id}>
                  <Flex gap="2" align="center">
                    <Checkbox
                      checked={z.fotoIds.includes(foto.id)}
                      onCheckedChange={(v: boolean | "indeterminate") =>
                        onPriradit(z.id, foto.id, v === true)
                      }
                    />
                    {popisZavady(z)}
                  </Flex>
                </Text>
              ))}
            </Flex>

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <Button color="red" variant="soft" mt="2">
                  <TrashIcon /> Smazat fotku
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Content maxWidth="400px">
                <AlertDialog.Title>Smazat fotku</AlertDialog.Title>
                <AlertDialog.Description>
                  Fotka se odstraní i ze všech závad, ke kterým je přiřazená (
                  {pouzitoU}). Tuto akci nelze vrátit zpět.
                </AlertDialog.Description>
                <Flex gap="3" mt="4" justify="end">
                  <AlertDialog.Cancel>
                    <Button variant="soft" color="gray">
                      Ne
                    </Button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action>
                    <Button color="red" onClick={smazat}>
                      Smazat
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default FotoProhlizec;
