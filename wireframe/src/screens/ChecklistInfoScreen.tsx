import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  Button,
  DropdownMenu,
  Dialog,
  Flex,
  Heading,
  Text,
  TextArea,
} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import FotoGalerie from "../components/FotoGalerie";
import { CHECKLIST } from "../checklist.tsx";
import type { ZapisContext } from "./ZapisScreen";
import type { Foto, Zavada } from "../types.tsx";

const popisky: Record<string, string> = {
  soulad: "Soulad",
  nesoulad: "Nesoulad",
  v_procesu: "Ve sledování",
  null: "Nevybráno",
};
const barvy: Record<string, "green" | "red" | "orange" | "gray"> = {
  soulad: "green",
  nesoulad: "red",
  v_procesu: "orange",
  null: "gray",
};
const MOZNOSTI: Zavada["stav"][] = ["soulad", "nesoulad", "v_procesu"];

const vyrobFotky = (urls: string[], dosavadni: Foto[]): Foto[] => {
  const start = Math.min(0, ...dosavadni.map((f) => f.id)) - 1;
  return urls.map((url, i) => ({
    id: start - i,
    url,
    porizeno: new Date().toISOString(),
    vyrazena: false,
  }));
};

function ChecklistInfoScreen() {
  const { cislo } = useParams();
  const navigate = useNavigate();
  const { checklist, ulozitChecklist, fotky, pridatFotky } =
    useOutletContext<ZapisContext>();

  const polozka = CHECKLIST.find((p) => p.cislo === Number(cislo))!;
  const zaznam = checklist.find((z) => z.cislo === Number(cislo))!;

  const [stav, setStav] = useState<Zavada["stav"]>(zaznam.stav);
  const [poznamka, setPoznamka] = useState(zaznam.poznamka);
  const [fotoIds, setFotoIds] = useState<number[]>(zaznam.fotoIds);
  const [nove, setNove] = useState<Foto[]>([]);
  const [stornoDialog, setStornoDialog] = useState(false);

  const zmenaProvedena =
    stav !== zaznam.stav ||
    poznamka !== zaznam.poznamka ||
    JSON.stringify(fotoIds) !== JSON.stringify(zaznam.fotoIds);

  const handleUlozit = () => {
    const cekajici = nove.filter((f) => fotoIds.includes(f.id));
    const realIds = pridatFotky(cekajici.map((f) => f.url));
    const mapa = new Map(cekajici.map((f, i) => [f.id, realIds[i]]));

    ulozitChecklist({
      ...zaznam,
      stav,
      poznamka,
      fotoIds: fotoIds.map((id) => mapa.get(id) ?? id),
    });
    navigate(-1);
  };

  const zahodit = () => {
    nove.forEach((f) => URL.revokeObjectURL(f.url));
    navigate(-1);
  };

  const handleStorno = () => {
    if (zmenaProvedena) setStornoDialog(true);
    else navigate(-1);
  };

  return (
    <Flex direction="column" gap="3" p="4" style={{ minHeight: "100svh" }}>
      <Heading size="4">Položka č. {polozka.cislo}</Heading>

      <Flex direction="column" gap="1">
        <Text weight="bold">{polozka.nazev}</Text>
        <Text size="2" color="gray">
          {polozka.vysvetlivka}
        </Text>
      </Flex>

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <Button
            size="3"
            variant="soft"
            color={barvy[stav]}
            style={{ justifyContent: "space-between" }}
          >
            {popisky[stav]}
            <ChevronDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          {MOZNOSTI.map((s) => (
            <DropdownMenu.Item
              key={s}
              color={barvy[s]}
              onSelect={() => setStav(s)}
            >
              {popisky[s]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <TextArea
        size="3"
        rows={4}
        value={poznamka}
        placeholder="Poznámka"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setPoznamka(e.target.value)
        }
      />

      <FotoGalerie
        fotky={[...fotky, ...nove].filter((f) => fotoIds.includes(f.id))}
        onPridat={(urls) => {
          const pridane = vyrobFotky(urls, nove);
          setNove((p) => [...p, ...pridane]);
          setFotoIds((p) => [...p, ...pridane.map((f) => f.id)]);
        }}
        onOdebrat={(id) => {
          if (id < 0) setNove((p) => p.filter((f) => f.id !== id));
          setFotoIds((p) => p.filter((i) => i !== id));
        }}
      />

      <Flex gap="3" mt="auto">
        <Button
          size="3"
          color="red"
          variant="soft"
          style={{ flex: 1 }}
          onClick={handleStorno}
        >
          Storno
        </Button>
        <Button
          size="3"
          color="green"
          style={{ flex: 1 }}
          onClick={handleUlozit}
        >
          Uložit
        </Button>
      </Flex>

      <Dialog.Root open={stornoDialog} onOpenChange={setStornoDialog}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Neuložené změny</Dialog.Title>
          <Dialog.Description>
            Provedli jste změny. Chcete je uložit?
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end" wrap="wrap">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Zpět k úpravám
              </Button>
            </Dialog.Close>
            <Button variant="soft" color="red" onClick={zahodit}>
              Zahodit
            </Button>
            <Button color="green" onClick={handleUlozit}>
              Uložit
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );
}

export default ChecklistInfoScreen;
