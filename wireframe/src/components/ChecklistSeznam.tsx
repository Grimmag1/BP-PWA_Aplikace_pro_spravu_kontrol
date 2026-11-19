import type { ChecklistZaznam, Zavada, Foto } from "../types";
import type { ChecklistSekce } from "../checklist";
import { NAZVY_SEKCI, CHECKLIST } from "../checklist";
import { Flex, Heading } from "@radix-ui/themes";
import ChecklistItem from "./ChecklistItem.tsx";

const SEKCE: ChecklistSekce[] = ["checklist", "dokumentace"];

function ChecklistSeznam({
  checklist,
  fotky,
  rozbalene,
  onToggle,
  onStav,
}: {
  checklist: ChecklistZaznam[];
  fotky: Foto[];
  rozbalene: number[];
  onToggle: (cislo: number) => void;
  onStav: (cislo: number, stav: Zavada["stav"]) => void;
}) {
  return (
    <Flex direction="column" gap="4" px="4" pt="3">
      {SEKCE.map((sekce) => (
        <Flex key={sekce} direction="column" gap="2">
          <Heading size="3">{NAZVY_SEKCI[sekce]}</Heading>
          {CHECKLIST.filter((p) => p.sekce === sekce).map((p) => {
            const zaznam = checklist.find((z) => z.cislo === p.cislo);
            if (!zaznam) return null;
            return (
              <ChecklistItem
                key={p.cislo}
                polozka={p}
                zaznam={zaznam}
                fotky={fotky}
                rozbaleno={rozbalene.includes(p.cislo)}
                onToggle={() => onToggle(p.cislo)}
                onStav={onStav}
              />
            );
          })}
        </Flex>
      ))}
    </Flex>
  );
}

export default ChecklistSeznam;
