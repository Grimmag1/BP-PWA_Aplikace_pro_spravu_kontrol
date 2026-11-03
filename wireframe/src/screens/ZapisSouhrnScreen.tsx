import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import type { ZapisContext } from "./ZapisScreen";
import { Flex, Heading, Button, Box, AlertDialog } from "@radix-ui/themes";
import SekceZavad from "../components/SekceZavad";
import HeaderStavby from "../components/HeaderStavby";
import { mockStavby } from "../mockdata.ts";
import { useState } from "react";

function ZapisSouhrnScreen() {
  const navigate = useNavigate();
  const { stavbaId } = useParams();
  const {
    predchoziZavady,
    aktualniZavady,
    zvyraznitNeuplne,
    setZvyraznitNeuplne,
  } = useOutletContext<ZapisContext>();

  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const noveCisloZapisu = stavba.zapisy.length + 1;

  const [pokracovatDialogOtevren, setPokracovatDialogOtevren] = useState(false);

  const zobrazene = [
    ...predchoziZavady.filter((z) => z.stav !== "soulad"),
    ...aktualniZavady,
  ];

  const neuplne = zobrazene.filter(
    (z) =>
      !z.name.trim() || !z.primaryDescription.trim() || z.foto.length === 0,
  );

  const zvyraznene = zvyraznitNeuplne ? neuplne.map((z) => z.id) : [];

  const pokracovat = () => navigate(`/stavba/${stavbaId}/zapis/dodatky`);

  const handlePokracovat = () => {
    if (neuplne.length > 0) {
      setPokracovatDialogOtevren(true);
    } else {
      pokracovat();
    }
  };

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
        zvyraznene={zvyraznene}
      />
      <SekceZavad
        nazev="Nové závady"
        zavady={aktualniZavady}
        barvaSekce="var(--blue-9)"
        zvyraznene={zvyraznene}
      />

      <Button size="4" onClick={handlePokracovat}>
        Pokračovat
      </Button>

      <AlertDialog.Root
        open={pokracovatDialogOtevren}
        onOpenChange={setPokracovatDialogOtevren}
      >
        <AlertDialog.Content maxWidth="400px">
          <AlertDialog.Title>Neúplné závady</AlertDialog.Title>
          <AlertDialog.Description>
            {neuplne.length === 1
              ? "Jedna závada nemá"
              : neuplne.length < 5
                ? `${neuplne.length} závady nemají`
                : `${neuplne.length} závad nemá`}{" "}
            vyplněný název, popis nebo fotku. Přejete si i přesto pokračovat?
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button
                variant="soft"
                color="gray"
                onClick={() => setZvyraznitNeuplne(true)}
              >
                Ne
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={pokracovat}>Ano</Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
}
export default ZapisSouhrnScreen;
