import type { Stavba } from "../types";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HomeIcon,
  PersonIcon,
  MobileIcon,
  CalendarIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Card, Button, Flex, IconButton, Text } from "@radix-ui/themes";

const HOLD_DELAY = 1000;

function StavbaItem({
  stavba,
  onNovyZapis,
}: {
  stavba: Stavba;
  onNovyZapis: (stavbaId: number) => void;
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
          <Flex
            align="center"
            justify="center"
            style={{
              width: "60px",
              height: "24px",
              border: "1px solid var(--gray-6)",
              borderRadius: "var(--radius-2)",
            }}
          >
            <CalendarIcon />
          </Flex>
          <IconButton
            variant="soft"
            size="1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/stavba/${stavba.id}/info`);
            }}
          >
            <InfoCircledIcon />
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
          <Text size="2">Jan Novak</Text>
          <Text size="2" color="gray">
            +420 123 456 789
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
