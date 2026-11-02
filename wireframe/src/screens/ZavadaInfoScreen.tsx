import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import type { ZapisContext } from "./ZapisScreen";
import {
  Box,
  Button,
  ChevronDownIcon,
  DropdownMenu,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";
import FotoGalerie from "../components/FotoGalerie";
import type { Zavada } from "../types.tsx";

function ZavadaInfoScreen() {
  const location = useLocation();
  const { zavadaId } = useParams();
  const { zavady, dalsiZavada, ulozitZavadu } =
    useOutletContext<ZapisContext>();
  const navigate = useNavigate();

  const [novaZavada] = useState(() =>
    zavadaId === "nova" ? dalsiZavada(location.state?.foto) : null,
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
  const [foto, setFoto] = useState<string[]>(zavada.foto);

  const zmenaProvedena =
    name !== zavada.name ||
    primaryDescription !== zavada.primaryDescription ||
    secondaryDescription !== zavada.secondaryDescription ||
    stav !== zavada.stav;

  const handleUlozit = () => {
    ulozitZavadu({
      ...zavada,
      name,
      primaryDescription,
      secondaryDescription,
      foto,
      stav,
    });
    navigate(-1);
  };

  const handleStorno = () => {
    setName(zavada.name);
    setPrimaryDescription(zavada.primaryDescription);
    setSecondaryDescription(zavada.secondaryDescription);
    setStav(zavada.stav);
    navigate(-1);
  };

  const handleZavrit = () => {
    if (zmenaProvedena) {
      if (window.confirm("Máte neuložené změny. Chcete je uložit?")) {
        handleUlozit();
      } else {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
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
              style={{ width: "var(--radix-dropdown-menu-trigger-width" }}
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
        </Flex>

        <IconButton onClick={handleZavrit}>X</IconButton>
      </Flex>

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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPrimaryDescription(e.target.value)
        }
        placeholder="Prvotní popis (viditelný v přehledu závad)"
        rows={3}
      />

      <TextArea
        size="3"
        value={secondaryDescription}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSecondaryDescription(e.target.value)
        }
        placeholder="Sekundární popis (viditelný v detailu závady)"
        rows={3}
      />

      <FotoGalerie fotky={foto} onChange={setFoto}></FotoGalerie>

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
    </Flex>
  );
}

export default ZavadaInfoScreen;
