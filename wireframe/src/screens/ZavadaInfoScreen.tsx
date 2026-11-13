import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import type { ZapisContext } from "./ZapisScreen";
import {
  Dialog,
  Box,
  Button,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import FotoGalerie from "../components/FotoGalerie";
import type { Zavada, Foto } from "../types.tsx";
import { TrashIcon, ChevronDownIcon } from "@radix-ui/react-icons";

function ZavadaInfoScreen() {
  const location = useLocation();
  const { zavadaId } = useParams();
  const {
    zavady,
    dalsiZavada,
    ulozitZavadu,
    smazatZavadu,
    fotky,
    pridatFotky,
  } = useOutletContext<ZapisContext>();
  const navigate = useNavigate();

  const [stornoDialog, setStornoDialog] = useState(false);

  const [novaZavada] = useState(() =>
    zavadaId === "nova" ? dalsiZavada() : null,
  );

  const zavada = novaZavada ?? zavady.find((z) => z.id === Number(zavadaId))!;

  const [name, setName] = useState(zavada.name);
  const [primaryDescription, setPrimaryDescription] = useState(
    zavada.primaryDescription,
  );
  const [secondaryDescription, setSecondaryDescription] = useState(
    zavada.secondaryDescription,
  );
  const [stav, setStav] = useState<Zavada["stav"]>(zavada.stav);
  const vyrobFotky = (urls: string[], dosavadni: Foto[]): Foto[] => {
    const start = Math.min(0, ...dosavadni.map((f) => f.id)) - 1;
    return urls.map((url, i) => ({
      id: start - i,
      url,
      porizeno: new Date().toISOString(),
      vyrazena: false,
    }));
  };
  const [noveFotky, setNoveFotky] = useState<Foto[]>(() =>
    vyrobFotky(location.state?.urls ?? [], []),
  );

  const [fotoIds, setFotoIds] = useState<number[]>(() => [
    ...zavada.fotoIds,
    ...noveFotky.map((f) => f.id),
  ]);
  const zmenaProvedena =
    name !== zavada.name ||
    primaryDescription !== zavada.primaryDescription ||
    secondaryDescription !== zavada.secondaryDescription ||
    stav !== zavada.stav ||
    JSON.stringify(fotoIds) !== JSON.stringify(zavada.fotoIds);

  const handleUlozit = () => {
    const cekajici = noveFotky.filter((f) => fotoIds.includes(f.id));
    const realIds = pridatFotky(cekajici.map((f) => f.url));
    const mapa = new Map(cekajici.map((f, i) => [f.id, realIds[i]]));
    ulozitZavadu({
      ...zavada,
      name,
      primaryDescription,
      secondaryDescription,
      fotoIds: fotoIds.map((id) => mapa.get(id) ?? id),
      stav,
    });
    navigate(-1);
  };

  const zahoditNoveFotky = () =>
    noveFotky.forEach((f) => URL.revokeObjectURL(f.url));

  const potrebaDialog =
    zmenaProvedena || (zavadaId === "nova" && fotoIds.length > 0);

  const handleStorno = () => {
    if (potrebaDialog) {
      setStornoDialog(true);
    } else {
      navigate(-1);
    }
  };

  const handleSmazat = () => {
    smazatZavadu(zavada.id);
    navigate(-1);
  };

  const barva: Record<string, string> = {
    nesoulad: "red",
    v_procesu: "orange",
    soulad: "green",
  };

  const stavLabel: Record<string, string> = {
    nesoulad: "Nesoulad",
    v_procesu: "V řešení",
    soulad: "Soulad",
  };

  const MOZNOSTI: Zavada["stav"][] = ["nesoulad", "v_procesu", "soulad"];

  return (
    <Flex direction="column" gap="3" p="4" style={{ minHeight: "100svh" }}>
      <Flex justify="between" align="center">
        <Flex align="baseline" gap="2">
          <Heading size="5">
            {zavada.typ === "povinna"
              ? `Povinná závada č. ${zavada.poradoveCislo})`
              : `Závada č. ${zavada.poradoveCislo}`}
          </Heading>
          {zavada.typ !== "povinna" && (
            <Text size="2" color="gray">
              {zavada.typ === "predchozi"
                ? `ze zápisu č. ${zavada.zdrojKontrola}`
                : "z aktuálního zápisu"}
            </Text>
          )}
        </Flex>

        {zavada.typ === "nova" && (
          <Dialog.Root>
            <Dialog.Trigger>
              <IconButton
                variant="ghost"
                color="red"
                aria-label="Smazat závadu"
              >
                <TrashIcon width="30" height="30" />
              </IconButton>
            </Dialog.Trigger>
            <Dialog.Content maxWidth="400px">
              <Dialog.Title>Smazat závadu</Dialog.Title>
              <Dialog.Description>
                Opravdu chcete smazat závadu č.{zavada.poradoveCislo}? Tuto akci
                nelze vrátit zpět.
              </Dialog.Description>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Ne
                  </Button>
                </Dialog.Close>
                <Button color="red" onClick={handleSmazat}>
                  Smazat
                </Button>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </Flex>

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <Button
            size="3"
            variant="soft"
            color={barva[stav]}
            style={{ justifyContent: "space-between" }}
          >
            {stavLabel[stav]}
            <ChevronDownIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
        >
          {MOZNOSTI.map((s) => (
            <DropdownMenu.Item
              key={s}
              color={barva[s]}
              onSelect={() => setStav(s)}
            >
              {stavLabel[s]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <TextField.Root
        size="3"
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        placeholder="Název závady"
      />

      <TextArea
        size="3"
        value={primaryDescription}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setPrimaryDescription(e.target.value)
        }
        placeholder="Prvotní popis (viditelný v přehledu závad)"
        rows={3}
      />

      <TextArea
        size="3"
        value={secondaryDescription}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setSecondaryDescription(e.target.value)
        }
        placeholder="Sekundární popis (viditelný v detailu závady)"
        rows={3}
      />

      <FotoGalerie
        fotky={[...fotky, ...noveFotky].filter((f) => fotoIds.includes(f.id))}
        onPridat={(urls) => {
          const pridane = vyrobFotky(urls, noveFotky);
          setNoveFotky((p) => [...p, ...pridane]);
          setFotoIds((p) => [...p, ...pridane.map((f) => f.id)]);
        }}
        onOdebrat={(id) => {
          if (id < 0) setNoveFotky((p) => p.filter((f) => f.id !== id));
          setFotoIds((p) => p.filter((i) => i !== id));
        }}
      ></FotoGalerie>

      <Flex gap="3">
        <Box flexGrow="1">
          <Button
            onClick={handleStorno}
            variant="soft"
            size="3"
            color="red"
            style={{ width: "100%" }}
          >
            Storno
          </Button>
        </Box>
        <Box flexGrow="1">
          <Button
            onClick={handleUlozit}
            color="green"
            size="3"
            style={{ width: "100%" }}
          >
            Uložit
          </Button>
        </Box>
      </Flex>

      <Dialog.Root open={stornoDialog} onOpenChange={setStornoDialog}>
        <Dialog.Content maxWidth="400px">
          <Dialog.Title>Neuložené změny</Dialog.Title>
          <Dialog.Description>
            Provedli jste změny.{" "}
            {noveFotky.length > 0 &&
              `Zahodí se i ${noveFotky.length} nových fotek.`}{" "}
            Chcete je uložit?
          </Dialog.Description>
          <Flex gap="3" mt="4" justify="end" wrap="wrap">
            <Dialog.Close>
              <Button varian="soft" color="gray">
                Zpět
              </Button>
            </Dialog.Close>
            <Button
              variant="soft"
              color="red"
              onClick={() => {
                zahoditNoveFotky();
                navigate(-1);
              }}
            >
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

export default ZavadaInfoScreen;
