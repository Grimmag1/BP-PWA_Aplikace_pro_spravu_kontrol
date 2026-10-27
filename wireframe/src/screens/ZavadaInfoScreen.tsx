import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { useState } from "react";
import type { ZapisContext } from "./ZapisScreen";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
  TextArea,
  TextField,
} from "@radix-ui/themes";

function ZavadaInfoScreen() {
  const { zavadaId } = useParams();
  const { zavady, dalsiZavada, ulozitZavadu } =
    useOutletContext<ZapisContext>();
  const navigate = useNavigate();

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

  const zmenaProvedena =
    name !== zavada.name ||
    primaryDescription !== zavada.primaryDescription ||
    secondaryDescription !== zavada.secondaryDescription;

  const handleUlozit = () => {
    ulozitZavadu({
      ...zavada,
      name,
      primaryDescription,
      secondaryDescription,
    });
    navigate(-1);
  };

  const handleStorno = () => {
    setName(zavada.name);
    setPrimaryDescription(zavada.primaryDescription);
    setSecondaryDescription(zavada.secondaryDescription);
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

  return (
    <Flex direction="column" gap="3" p="4" style={{ minHeight: "100svh" }}>
      <Flex justify="between" align="center">
        <Flex align="baseline" gap="2">
          <Heading size="5">Závada č. {zavada.poradoveCislo}</Heading>
          <Text size="2" color="gray">
            {zavada.zdrojKontrola !== null
              ? `ze zápisu č. ${zavada.zdrojKontrola}`
              : "z aktuálního zápisu"}
          </Text>
        </Flex>

        <IconButton variant="ghost" color="gray" onClick={handleZavrit}>
          X
        </IconButton>
      </Flex>

      <TextField.Root
        size="3"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Název závady"
      />

      <TextArea
        size="3"
        value={primaryDescription}
        onChange={(e) => setPrimaryDescription(e.target.value)}
        placeholder="Prvotní popis (viditelný v přehledu závad)"
        rows={3}
      />

      <TextArea
        size="3"
        value={secondaryDescription}
        onChange={(e) => setSecondaryDescription(e.target.value)}
        placeholder="Sekundární popis (viditelný v detailu závady)"
        rows={3}
      />

      <Card style={{ flex: 1, minHeight: 160 }}>
        <Flex height="100%" align="center" justify="center">
          <Text color="gray">Vložit foto/otevřít kameru</Text>
        </Flex>
      </Card>

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
