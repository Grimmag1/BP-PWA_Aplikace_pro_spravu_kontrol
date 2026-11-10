import type { Zavada } from "../types.tsx";
import { Flex, Text } from "@radix-ui/themes";
import ZavadaItem from "./ZavadaItem.tsx";
import AddZavadaButton from "./AddZavadaButton.tsx";

function SeznamZavad({
  zavady,
  rozbalene,
  onToggle,
  onStavChange,
  onPridatZavadu,
  showAddButton = false,
}: {
  zavady: Zavada[];
  rozbalene: number[];
  onToggle: (id: number) => void;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
  onPridatZavadu?: (foto: string[]) => void;
  showAddButton?: boolean;
}) {
  return (
    <Flex direction="column" gap="2" pt="3" px="4">
      {zavady.length === 0 && (
        <Text align="center" color="gray" size="2" py="3">
          <em>Zatím žádné závady</em>
        </Text>
      )}
      {zavady.map((z) => (
        <ZavadaItem
          key={z.id}
          zavada={z}
          rozbaleno={rozbalene.includes(z.id)}
          onToggle={() => onToggle(z.id)}
          onStavChange={onStavChange}
        />
      ))}
      {showAddButton && <AddZavadaButton onPridat={onPridatZavadu} />}
    </Flex>
  );
}

export default SeznamZavad;
