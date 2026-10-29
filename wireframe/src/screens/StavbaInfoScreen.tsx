import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { mockStavby } from "../mockdata";

function StavbaInfoScreen() {
  const navigate = useNavigate();
  const { stavbaId } = useParams();
  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;

  return (
    <Box style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Flex
        p="4"
        align="center"
        gap="2"
        style={{ borderBottom: "1px solid var(--gray-4)", flexShrink: 0 }}
      >
        <IconButton variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
        <Heading size="6" style={{ flex: 1, textAlign: "center" }}>
          {stavba.jmeno}
        </Heading>
        <Box style={{ width: 32 }} />
      </Flex>

      <Tabs.Root
        defaultValue="info"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Tabs.List style={{ flexShrink: 0 }}>
          <Tabs.Trigger value="info" style={{ flex: 1 }}>
            Informace
          </Tabs.Trigger>
          <Tabs.Trigger value="dokumenty" style={{ flex: 1 }}>
            Dokumenty
          </Tabs.Trigger>
          <Tabs.Trigger value="zapisy" style={{ flex: 1 }}>
            Zápisy
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="info" style={{ flex: 1, overflowY: "auto" }}>
          <Flex direction="column" gap="3" p="4">
            <Box>
              <Text size="1" color="gray" mb="1">
                Název stavby
              </Text>
              <TextField.Root defaultValue={stavba.jmeno} />
            </Box>
            <Box>
              <Text size="1" color="gray" mb="1">
                Adresa
              </Text>
              <TextField.Root defaultValue={stavba.adresa} />
            </Box>
            <Box>
              <Text size="1" color="gray" mb="1">
                Zhotovitel
              </Text>
              <TextField.Root defaultValue={stavba.zhotovitel} />
            </Box>
            <Box>
              <Text size="1" color="gray" mb="1">
                Kontaktní osoba
              </Text>
              <TextField.Root defaultValue={stavba.kontaktOsoba} />
            </Box>
            <Box>
              <Text size="1" color="gray" mb="1">
                Telefon
              </Text>
              <TextField.Root defaultValue={stavba.kontaktTelefon} />
            </Box>
          </Flex>
        </Tabs.Content>

        <Tabs.Content value="dokumenty" style={{ flex: 1, overflowY: "auto" }}>
          <p>TODO</p>
        </Tabs.Content>
        <Tabs.Content value="zapisy" style={{ flex: 1, overflowY: "auto" }}>
          <p>TODO</p>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}

export default StavbaInfoScreen;
