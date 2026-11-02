import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import type { ZapisContext } from "./ZapisScreen";
import { Flex, Heading, Button, Box } from "@radix-ui/themes";
import SekceZavad from "../components/SekceZavad";
import HeaderStavby from "../components/HeaderStavby";
import { mockStavby } from "../mockdata.ts";

function ZapisSouhrnScreen() {
  const navigate = useNavigate();
  const { stavbaId } = useParams();
  const { predchoziZavady, aktualniZavady } = useOutletContext<ZapisContext>();

  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const noveCisloZapisu = stavba.zapisy.length + 1;

  return (
    <Flex direction="column" gap="4" p="4">
      <Box
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "var(--color-background)",
          zIndex: 10,
          paddingBottom: "8px",
        }}
      >
        <HeaderStavby stavba={stavba} cisloZapisu={noveCisloZapisu} />
        <Heading size="5" style={{ flex: 1, textAlign: "center" }}>
          Kontrola závad
        </Heading>
      </Box>

      <SekceZavad
        nazev="Nevyřešené závady z předchozích kontrol"
        zavady={predchoziZavady.filter((z) => z.stav !== "soulad")}
        barvaSekce="var(--red-9)"
      />
      <SekceZavad
        nazev="Nové závady"
        zavady={aktualniZavady}
        barvaSekce="var(--blue-9)"
      />

      <Button
        size="4"
        onClick={() => navigate(`/stavba/${stavbaId}/zapis/dodatky`)}
      >
        Pokračovat
      </Button>
    </Flex>
  );
}
export default ZapisSouhrnScreen;
