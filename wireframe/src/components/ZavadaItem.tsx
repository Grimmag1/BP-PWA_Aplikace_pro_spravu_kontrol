import type { Zavada } from "../types.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Card, Flex, Separator, Text } from "@radix-ui/themes";

function ZavadaItem({
  zavada,
  onStavChange,
}: {
  zavada: Zavada;
  onStavChange?: (id: number, stav: Zavada["stav"]) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const nextStav = (current: Zavada["stav"]): Zavada["stav"] => {
    if (current === "nesoulad") return "soulad";
    if (current === "soulad") return "v_procesu";
    if (current === "v_procesu") return "nesoulad";
    return "nesoulad";
  };

  const barva: Record<string, string> = {
    nesoulad: "var(--red-9)",
    v_procesu: "var(--orange-9)",
    soulad: "var(--green-9)",
  };

  const stavLeft: Record<string, string> = {
    nesoulad: "4px",
    v_procesu: "calc(50% - 12px)",
    soulad: "calc(100% - 28px)",
    null: "4px",
  };

  return (
    <Card
      onClick={() => navigate(`${location.pathname}/zavada/${zavada.id}`)}
      style={{
        cursor: "pointer",
      }}
    >
      <Flex align="center" justify="between" gap="3">
        <Text weight="bold">
          {zavada.poradoveCislo}/{zavada.zdrojKontrola} {zavada.name}
        </Text>

        <Box
          onClick={(e) => {
            e.stopPropagation();
            onStavChange?.(zavada.id, nextStav(zavada.stav));
          }}
          style={{
            position: "relative",
            flexShrink: 0,
            width: "80px",
            height: "32px",
            backgroundColor: "var(--gray-4)",
            borderRadius: "9999px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: "4px",
              left: stavLeft[zavada.stav],
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor:
                zavada.stav !== "null" ? barva[zavada.stav] : "var(--gray-8)",
              transition: "left 0.25s ease, background-color 0.25s ease",
            }}
          />
        </Box>
      </Flex>

      <Separator size="4" my="2" />

      <Flex gap="3">
        <Text style={{ flex: 1 }} size="2">
          {zavada.primaryDescription}
        </Text>
        {zavada.foto ? (
          <img
            src={zavada.foto}
            alt="foto závady"
            style={{
              width: "80px",
              height: "80px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
          />
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
  );
}

export default ZavadaItem;
