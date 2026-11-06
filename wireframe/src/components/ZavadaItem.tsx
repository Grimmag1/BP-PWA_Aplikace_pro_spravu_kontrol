import type { Zavada } from "../types.tsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  Flex,
  Separator,
  Text,
  Badge,
  DropdownMenu,
  Button,
} from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";

function ZavadaItem({
  zavada,
  onStavChange,
  zvyraznit,
}: {
  zavada: Zavada;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
  zvyraznit?: boolean;
}) {
  const navigate = useNavigate();
  const { stavbaId } = useParams();

  const barva: Record<string, string> = {
    nesoulad: "red",
    v_procesu: "orange",
    soulad: "green",
  };

  const stavLabel: Record<string, string> = {
    nesoulad: "Nesoulad",
    v_procesu: "V řešení",
    soulad: "Soulad",
  };

  const MOZNOSTI: Zavada["stav"][] = ["nesoulad", "v_procesu", "soulad"];

  const cislo =
    zavada.typ === "povinna"
      ? `${zavada.poradoveCislo})`
      : zavada.povinnaIndex != null
        ? `Ad ${zavada.povinnaIndex}) ${zavada.poradoveCislo}/${zavada.zdrojKontrola}`
        : `${zavada.poradoveCislo}/${zavada.zdrojKontrola}`;

  return (
    <div
      style={{
        borderLeft: `5px solid ${zvyraznit ? "var(--red-9)" : "transparent"}`,
        borderRadius: "var(--radius-3)",
        overflow: "hidden",
      }}
    >
      <Card
        onClick={() =>
          navigate(`/stavba/${stavbaId}/zapis/zavada/${zavada.id}`)
        }
        style={{
          cursor: "pointer",
        }}
      >
        <Flex align="center" justify="between" gap="3">
          <Text weight="bold">
            {cislo} {zavada.name}
          </Text>
          {onStavChange ? (
            <DropdownMenu.Root modal={false}>
              <DropdownMenu.Trigger>
                <Button
                  size="2"
                  variant="soft"
                  color={barva[zavada.stav]}
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  style={{ flexShrink: 0 }}
                >
                  {stavLabel[zavada.stav]}
                  <ChevronDownIcon />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                {MOZNOSTI.map((s) => (
                  <DropdownMenu.Item
                    key={s}
                    color={barva[s]}
                    onSelect={() => onStavChange(zavada.id, s)}
                  >
                    {stavLabel[s]}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ) : (
            zavada.stav !== "null" && (
              <Badge
                size="2"
                variant="soft"
                color={
                  zavada.stav === "nesoulad"
                    ? "red"
                    : zavada.stav === "soulad"
                      ? "green"
                      : "orange"
                }
              >
                {stavLabel[zavada.stav]}
              </Badge>
            )
          )}
        </Flex>

        <Separator size="4" my="2" />
        <Flex gap="3">
          <Text style={{ flex: 1 }} size="2">
            {zavada.primaryDescription}
          </Text>
          {zavada.foto.length > 0 ? (
            <Box style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={zavada.foto[0]}
                alt="foto zavady"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
              {zavada.foto.length > 1 && (
                <Badge style={{ position: "absolute", bottom: 4, right: 4 }}>
                  +{zavada.foto.length - 1}
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
      </Card>
    </div>
  );
}

export default ZavadaItem;
