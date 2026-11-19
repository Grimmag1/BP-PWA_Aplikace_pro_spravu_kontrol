import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Box,
  Button,
  Card,
  DropdownMenu,
  Flex,
  Separator,
  Text,
} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ChecklistPolozka } from "../checklist.tsx";
import type { ChecklistZaznam, Foto, Zavada } from "../types.tsx";

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

function ChecklistItem({
  polozka,
  zaznam,
  fotky,
  rozbaleno,
  onToggle,
  onStav,
}: {
  polozka: ChecklistPolozka;
  zaznam: ChecklistZaznam;
  fotky: Foto[];
  rozbaleno: boolean;
  onToggle: () => void;
  onStav: (cislo: number, stav: Zavada["stav"]) => void;
}) {
  const navigate = useNavigate();
  const { stavbaId } = useParams();

  const fotkyPolozky = fotky.filter(
    (f) => zaznam.fotoIds.includes(f.id) && !f.vyrazena,
  );

  return (
    <Card onClick={onToggle} style={{ cursor: "pointer" }}>
      <Flex align="center" justify="between" gap="3">
        <Text weight="bold">
          {polozka.cislo}. {polozka.nazev}
        </Text>

        <DropdownMenu.Root modal={false}>
          <DropdownMenu.Trigger>
            <Button
              size="2"
              variant="soft"
              color={barvy[zaznam.stav]}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              style={{ flexShrink: 0 }}
            >
              {popisky[zaznam.stav]}
              <ChevronDownIcon />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {MOZNOSTI.map((s) => (
              <DropdownMenu.Item
                key={s}
                color={barvy[s]}
                onSelect={() => onStav(polozka.cislo, s)}
              >
                {popisky[s]}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>

      {rozbaleno && (
        <>
          <Separator size="4" my="2" />
          <Flex gap="3">
            <Text
              size="2"
              color={zaznam.poznamka ? undefined : "gray"}
              style={{ flex: 1 }}
            >
              {zaznam.poznamka || "Bez poznámky"}
            </Text>

            {fotkyPolozky.length > 0 ? (
              <Box style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={fotkyPolozky[0].url}
                  alt="foto položky"
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
                {fotkyPolozky.length > 1 && (
                  <Badge style={{ position: "absolute", bottom: 4, right: 4 }}>
                    +{fotkyPolozky.length - 1}
                  </Badge>
                )}
              </Box>
            ) : (
              <Flex
                align="center"
                justify="center"
                flexShrink="0"
                width="80px"
                height="80px"
                style={{
                  backgroundColor: "var(--gray-3)",
                  borderRadius: "var(--radius-2)",
                }}
              >
                <Text size="1" color="gray">
                  Bez fotky
                </Text>
              </Flex>
            )}
          </Flex>

          <Button
            variant="soft"
            mt="3"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              navigate(`/stavba/${stavbaId}/zapis/checklist/${polozka.cislo}`);
            }}
          >
            Upravit
          </Button>
        </>
      )}
    </Card>
  );
}

export default ChecklistItem;
