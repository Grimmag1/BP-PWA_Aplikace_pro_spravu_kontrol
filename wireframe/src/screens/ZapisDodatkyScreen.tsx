import {
  Flex,
  Box,
  Heading,
  TextArea,
  Text,
  TextField,
  IconButton,
  Button,
  Card,
} from "@radix-ui/themes";
import HeaderStavby from "../components/HeaderStavby";
import { mockStavby } from "../mockdata";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import CheckboxPole from "../components/CheckboxPole";
import type { ZapisContext } from "./ZapisScreen";
import type { Dodatky, Zhotovitel } from "../types";
import { TrashIcon, PlusIcon } from "@radix-ui/react-icons";

function ZapisDodatkyScreen() {
  const { stavbaId } = useParams();
  const { dodatky, setDodatky } = useOutletContext<ZapisContext>();
  const stavba = mockStavby.find((s) => s.id === Number(stavbaId))!;
  const noveCisloZapisu = stavba.zapisy.length + 1;
  const navigate = useNavigate();

  const handleDokoncit = () => {
    //TODO generace PDF a ulozeni zapisu
    navigate("/");
  };

  const upravit = (patch: Partial<Dodatky>) =>
    setDodatky((d) => ({ ...d, ...patch }));

  const zmenitCinnost = (i: number, text: string) =>
    upravit({ cinnosti: dodatky.cinnosti.map((c, j) => (j === i ? text : c)) });
  const smazatCinnost = (i: number) =>
    upravit({ cinnosti: dodatky.cinnosti.filter((_, j) => j !== i) });
  const pridatCinnost = () => upravit({ cinnosti: [...dodatky.cinnosti, ""] });

  const upravitZhotovitele = (id: number, patch: Partial<Zhotovitel>) =>
    upravit({
      zhotovitele: dodatky.zhotovitele.map((z) =>
        z.id === id ? { ...z, ...patch } : z,
      ),
    });

  const smazatZhotovitele = (id: number) =>
    upravit({ zhotovitele: dodatky.zhotovitele.filter((z) => z.id !== id) });

  const pridatZhotovitele = () =>
    upravit({
      zhotovitele: [
        ...dodatky.zhotovitele,
        {
          id: Math.max(0, ...dodatky.zhotovitele.map((z) => z.id)) + 1,
          nazev: "",
          ic: "",
          kontaktOsoba: "",
          kontaktTelefon: "",
          kontaktMail: "",
          predlozeniRizik: false,
          predlozeniTP: false,
        },
      ],
    });

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
          Dodatky
        </Heading>
      </Box>

      <Flex direction="column" gap="2">
        <CheckboxPole
          label="Předložení rizik"
          checked={dodatky.predlozeniRizik}
          onChange={(v) => upravit({ predlozeniRizik: v })}
        />
        <CheckboxPole
          label="Předložení TP"
          checked={dodatky.predlozeniTP}
          onChange={(v) => upravit({ predlozeniTP: v })}
        />
      </Flex>

      <Flex direction="column" gap="2">
        <Heading size="3">Prováděné činnosti v době kontroly</Heading>
        {dodatky.cinnosti.map((c, i) => (
          <Flex key={i} align="center" gap="2">
            <Text>•</Text>
            <Box style={{ flex: 1 }}>
              <TextField.Root
                value={c}
                placeholder="Činnost"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  zmenitCinnost(i, e.target.value)
                }
              />
            </Box>
            <IconButton
              variant="ghost"
              color="red"
              aria-label="Smazat činnosti"
              onClick={() => smazatCinnost(i)}
            >
              <TrashIcon />
            </IconButton>
          </Flex>
        ))}
        <Button varian="soft" onClick={pridatCinnost}>
          <PlusIcon>Přidat činnost</PlusIcon>
        </Button>
      </Flex>

      <Flex direction="column" gap="2">
        <Heading size="3">Poznámky a aktuality</Heading>
        <TextArea
          rows={4}
          value={dodatky.poznamky}
          placeholder="Poznámky pište zde..."
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            upravit({ poznamky: e.target.value })
          }
        />
      </Flex>

      <Flex direction="column" gap="2">
        <Heading size="3">Zhotovitelé</Heading>
        {dodatky.zhotovitele.length === 0 && (
          <Text size="2" color="gray" align="center">
            <em>Zatím žádní zhotovitelé</em>
          </Text>
        )}

        {dodatky.zhotovitele.map((z) => (
          <Card key={z.id}>
            <Flex direction="column" gap="2">
              <Flex align="center" gap="2">
                <Box style={{ flex: 1 }}>
                  <TextField.Root
                    value={z.nazev}
                    placeholder="Název"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      upravitZhotovitele(z.id, { nazev: e.target.value })
                    }
                  />
                </Box>
                <IconButton
                  variant="ghost"
                  color="red"
                  aria-label="Odebrat zhotovitele"
                  onClick={() => smazatZhotovitele(z.id)}
                >
                  <TrashIcon />
                </IconButton>
              </Flex>

              <TextField.Root
                value={z.ic}
                placeholder="IČ"
                inputMode="numeric"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  upravitZhotovitele(z.id, { ic: e.target.value })
                }
              />
              <TextField.Root
                value={z.kontaktMail}
                placeholder="Jméno a příjmení odpovědné osoby"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  upravitZhotovitele(z.id, { kontaktOsoba: e.target.value })
                }
              />
              <TextField.Root
                value={z.kontaktTelefon}
                placeholder="Telefon"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  upravitZhotovitele(z.id, { kontaktTelefon: e.target.value })
                }
              />
              <TextField.Root
                value={z.kontaktMail}
                placeholder="E-mail"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  upravitZhotovitele(z.id, { kontaktMail: e.target.value })
                }
              />

              <CheckboxPole
                label="Předložení rizik"
                checked={z.predlozeniRizik}
                onChange={(v) =>
                  upravitZhotovitele(z.id, { predlozeniRizik: v })
                }
              />
              <CheckboxPole
                label="Předložení TP"
                checked={z.predlozeniTP}
                onChange={(v) => upravitZhotovitele(z.id, { predlozeniTP: v })}
              />
            </Flex>
          </Card>
        ))}

        <Button variant="soft" onClick={pridatZhotovitele}>
          <PlusIcon>Přidat zhotovitele</PlusIcon>
        </Button>
      </Flex>
      <Button size="4" color="green" onClick={handleDokoncit}>
        Dokončit
      </Button>
    </Flex>
  );
}
export default ZapisDodatkyScreen;
