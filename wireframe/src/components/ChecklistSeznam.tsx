import type { ChecklistZaznam, Zavada } from "../types";
import type { ChecklistSekce } from "../checklist";
import { NAZVY_SEKCI, CHECKLIST } from "../checklist";
import {
  Flex,
  Heading,
  Card,
  Box,
  Text,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import { ChevronDownIcon } from "lucide-react";

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
const SEKCE: ChecklistSekce[] = ["checklist", "dokumentace"];

function ChecklistSeznam({
  checklist,
  onStav,
}: {
  checklist: ChecklistZaznam[];
  onStav: (cislo: number, stav: Zavada["stav"]) => void;
}) {
  return (
    <Flex direction="column" gap="4" px="4" pt="3">
      {SEKCE.map((sekce) => (
        <Flex key={sekce} direction="column" gap="2">
          <Heading size="3">{NAZVY_SEKCI[sekce]}</Heading>

          {CHECKLIST.filter((p) => p.sekce === sekce).map((p) => {
            const zaznam = checklist.find((z) => z.cislo === p.cislo);
            if (!zaznam) {
              return null;
            }
            return (
              <Card key={p.cislo}>
                <Flex align="center" justify="between" gap="3">
                  <Box>
                    <Text weight="bold">
                      {p.cislo}. {p.nazev}
                    </Text>{" "}
                    <Text size="2" color="gray">
                      {p.vysvetlivka}
                    </Text>
                  </Box>

                  <DropdownMenu.Root modal={false}>
                    <DropdownMenu.Trigger>
                      <Button
                        size="2"
                        variant="soft"
                        color={barvy[zaznam.stav]}
                        style={{ flexShrink: 0 }}
                      >
                        {popisky[zaznam.stav]}
                        <ChevronDownIcon />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {MOZNOSTI.map((s) => (
                        <DropdownMenu.Item
                          key={s}
                          color={barvy[s]}
                          onSelect={() => onStav(p.cislo, s)}
                        >
                          {popisky[s]}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      ))}
    </Flex>
  );
}

export default ChecklistSeznam;
