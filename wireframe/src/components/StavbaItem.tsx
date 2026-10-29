import type { Stavba } from "../types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  PersonIcon,
  MobileIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  Button,
  Flex,
  IconButton,
  Text,
  Popover,
} from "@radix-ui/themes";

const HOLD_DELAY = 1000;

function StavbaItem({
  stavba,
  onNovyZapis,
  openPopoverId,
  setOpenPopoverId,
}: {
  stavba: Stavba;
  onNovyZapis: (stavbaId: number) => void;
  openPopoverId: number | null;
  setOpenPopoverId: (id: number | null) => void;
}) {
  const navigate = useNavigate();

  const startPress = useRef<number | null>(null);
  const [pressed, setPressed] = useState(false);

  const handleMouseDown = () => {
    startPress.current = Date.now();
    setPressed(true);
  };
  const handleMouseUp = () => {
    setPressed(false);
    if (startPress.current && Date.now() - startPress.current > HOLD_DELAY) {
      navigate(`/stavba/${stavba.id}/info`);
    }
    startPress.current = null;
  };

  const DNY = ["P", "Ú", "S", "Č", "P", "S", "N"];
  const [dnyKontroly, setDnyKontroly] = useState<number[]>(stavba.dnyKontroly);
  const jeOtevrenPopover = openPopoverId === stavba.id;

  return (
    <Card
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        backgroundColor: pressed ? "var(--gray-3)" : undefined,
        transition: pressed
          ? `background-color ${HOLD_DELAY}ms ease`
          : "background-color 0.1s ease",
        userSelect: "none",
      }}
    >
      <Flex justify="between" align="center" mb="2">
        <Text weigh="bold" size="4">
          {stavba.jmeno}
        </Text>
        <Flex align="center" gap="2">
          <Popover.Root
            open={jeOtevrenPopover}
            onOpenChange={(open) => setOpenPopoverId(open ? stavba.id : null)}
          >
            <Popover.Trigger onClick={(e) => e.stopPropagation()}>
              <Flex align="center" gap="1" style={{ curson: "pointer" }}>
                {DNY.map((den, i) => (
                  <Flex
                    key={i}
                    align="center"
                    justify="center"
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: dnyKontroly.includes(i)
                        ? "var(--accent-9)"
                        : "var(--gray-3)",
                      color: dnyKontroly.includes(i)
                        ? "white"
                        : "var(--gray-8)",
                      fontSize: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {den}
                  </Flex>
                ))}
              </Flex>
            </Popover.Trigger>

            <Popover.Content onClick={(e) => e.stopPropagation()}>
              <Flex gap="2">
                {DNY.map((den, i) => (
                  <Flex
                    key={i}
                    align="center"
                    justify="center"
                    onClick={() =>
                      setDnyKontroly((prev) =>
                        prev.includes(i)
                          ? prev.filter((d) => d !== i)
                          : [...prev, i],
                      )
                    }
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: dnyKontroly.includes(i)
                        ? "var(--accent-9)"
                        : "var(--gray-3)",
                      color: dnyKontroly.includes(i)
                        ? "white"
                        : "var(--gray-8)",
                      fontSize: "13px",
                      fontWeight: "bold",
                    }}
                  >
                    {den}
                  </Flex>
                ))}
              </Flex>
            </Popover.Content>
          </Popover.Root>

          <IconButton
            variant="soft"
            size="2"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/stavba/${stavba.id}/info`);
            }}
          >
            <InfoCircledIcon width="16" height="16" />
          </IconButton>
        </Flex>
      </Flex>

      <Flex align="center" gap="2" mb="1">
        <HomeIcon color="gray" />
        <Text size="2">{stavba.adresa}</Text>
      </Flex>

      <Flex align="center" gap="2" mb="1">
        <PersonIcon color="gray" />
        <Text size="2">{stavba.zhotovitel}</Text>
      </Flex>

      <Flex align="center" gap="2" mb="1">
        <MobileIcon color="gray" />
        <Flex flex="1" justify="between">
          <Text size="2">{stavba.kontaktOsoba}</Text>
          <Text size="2" color="gray">
            {stavba.kontaktTelefon}
          </Text>
        </Flex>
      </Flex>

      <Button
        onClick={() => onNovyZapis(stavba.id)}
        style={{
          width: "100%",
        }}
      >
        Nový zápis
      </Button>
    </Card>
  );
}

export default StavbaItem;
