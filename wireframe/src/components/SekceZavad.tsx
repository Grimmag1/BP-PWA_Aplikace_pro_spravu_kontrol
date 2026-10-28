import { useState } from "react";
import type { Zavada } from "../types.tsx";
import ZavadaItem from "./ZavadaItem.tsx";
import AddZavadaButton from "./AddZavadaButton.tsx";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

function SekceZavad({
  nazev,
  zavady,
  showAddButton = false,
  onStavChange,
  onPridatZavadu,
  barvaSekce,
}: {
  nazev: string;
  zavady: Zavada[];
  showAddButton?: boolean;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
  onPridatZavadu?: () => void;
  barvaSekce?: string;
}) {
  const [rozbaleno, setRozbaleno] = useState(true);

  return (
    <Box>
      <Flex
        justify="between"
        align="center"
        px="3"
        py="2"
        onClick={() => setRozbaleno(!rozbaleno)}
        style={{
          cursor: "pointer",
          backgroundColor: "var(--gray-3)",
          borderRadius: "1px solid var(--gray-6)",
        }}
      >
        <Heading size="4">{nazev}</Heading>
        <Text size="2" color="gray">
          {rozbaleno ? "Skrýt" : "Zobrazit"}
        </Text>
      </Flex>

      <Box
        style={{
          backgroundColor: barvaSekce
            ? `color-mix(in srgb, ${barvaSekce} 10%, transparent)`
            : undefined,
          borderRadius: "var(--radius-3)",
          padding: barvaSekce ? "8px" : undefined,
        }}
      >
        {rozbaleno && (
          <Flex direction="column" gap="2" mt="2">
            {zavady.length === 0 && (
              <Text align="center" color="gray" size="2" py="3">
                <em>Zatím žádné závady</em>
              </Text>
            )}
            {zavady.map((zavada) => (
              <ZavadaItem
                key={zavada.id}
                zavada={zavada}
                onStavChange={onStavChange}
              />
            ))}
          </Flex>
        )}

        {showAddButton && (
          <Box mt="2">
            <AddZavadaButton onBezFotky={onPridatZavadu} />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SekceZavad;
