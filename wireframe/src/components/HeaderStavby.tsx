// src/components/HeaderStavby.tsx
import type { Stavba, Zapis } from "../types.tsx";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Heading, IconButton, Text } from "@radix-ui/themes";
import { ArrowLeftIcon, InfoCircledIcon } from "@radix-ui/react-icons";

function HeaderStavby({
  stavba,
  cisloZapisu,
}: {
  stavba: Stavba;
  cisloZapisu: Zapis["poradoveCislo"];
}) {
  const [datum, setDatum] = useState<Date>(new Date());
  const navigate = useNavigate();

  return (
    <Flex direction="column" gap="2">
      <Flex align="center" justify="between" gap="2">
        <IconButton onClick={() => navigate("/")}>
          <ArrowLeftIcon />
        </IconButton>

        <Heading size="6" align="center" style={{ flex: 1 }}>
          {stavba.jmeno}
        </Heading>

        <IconButton onClick={() => navigate(`/stavba/${stavba.id}/info`)}>
          <InfoCircledIcon />
        </IconButton>
      </Flex>

      <Flex justify="between" align="center">
        <Text weight="medium" style={{ whiteSpace: "nowrap" }}>
          Kontrola č. {cisloZapisu}
        </Text>

        <input
          type="date"
          value={datum.toISOString().split("T")[0]}
          onChange={(e) => setDatum(new Date(e.target.value))}
          style={{
            border: "none",
            backgroundColor: "transparent",
            fontSize: "14px",
            cursor: "pointer",
            color: "var(--gray-11)",
          }}
        />
      </Flex>
    </Flex>
  );
}

export default HeaderStavby;
