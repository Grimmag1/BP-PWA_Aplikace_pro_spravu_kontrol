import { useNavigate } from "react-router-dom";
import { mockStavby } from "../mockdata.ts";
import StavbaItem from "../components/StavbaItem.tsx";
import { useState } from "react";
import {
  Box,
  Flex,
  SegmentedControl,
  TextField,
  Text,
  IconButton,
} from "@radix-ui/themes";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import type { Stavba } from "../types.tsx";

const DNY = ["P", "Ú", "S", "Č", "P", "S", "N"];

function SeznamStavebScreen() {
  const navigate = useNavigate();
  const handleNovyZapis = (stavbaId: number) => {
    navigate(`/stavba/${stavbaId}/zapis/`);
  };
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const [hledani, setHledani] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "vše" | "aktivní" | "ukončená"
  >("vše");
  const [filterDen, setFilterDen] = useState<number | null>(null);
  const [order, setOrder] = useState<"abc_sestupne" | "abc_vzestupne" | "den">(
    "abc_sestupne",
  );
  const [filterRozbaleno, setFilterRozbaleno] = useState(false);

  const filtrovaneStavby = mockStavby.filter((s) => {
    const hledaniOdpovida =
      s.jmeno.toLowerCase().includes(hledani.toLowerCase()) ||
      s.adresa.toLowerCase().includes(hledani.toLowerCase()) ||
      s.zhotovitel.toLowerCase().includes(hledani.toLowerCase()) ||
      s.kontaktOsoba.toLowerCase().includes(hledani.toLowerCase());

    const statusOdpovida = filterStatus === "vše" || s.status === filterStatus;
    const denOdpovida = filterDen === null || s.dnyKontroly.includes(filterDen);

    return hledaniOdpovida && statusOdpovida && denOdpovida;
  });

  const seraditStavby = (stavby: Stavba[]) => {
    if (order === "abc_sestupne") {
      return [...stavby].sort((a, b) => a.jmeno.localeCompare(b.jmeno));
    } else if (order === "abc_vzestupne") {
      return [...stavby].sort((a, b) => b.jmeno.localeCompare(a.jmeno));
    } else if (order === "den") {
      const dnesIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

      const nejblizsiDen = (stavba: Stavba) => {
        if (stavba.dnyKontroly.length === 0) return 7;
        const dny = stavba.dnyKontroly.map((d) => (d - dnesIndex + 7) % 7);
        return Math.min(...dny);
      };

      return [...stavby].sort((a, b) => {
        const rozdil = nejblizsiDen(a) - nejblizsiDen(b);
        if (rozdil !== 0) return rozdil;
        else return a.jmeno.localeCompare(b.jmeno);
      });
    }

    return stavby;
  };

  const zobrazeneStavby = seraditStavby(filtrovaneStavby);

  return (
    <Box
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        p="4"
        style={{
          backgroundColor: "var(--color-background)",
          borderBottom: "1px solid var(--gray-4)",
          flexShrink: 0,
        }}
      >
        <Flex justify="between" align="center" mb="3">
          <Text size="6" weight="bold">
            Seznam staveb
          </Text>
          <IconButton
            variant="soft"
            onClick={() => setFilterRozbaleno(!filterRozbaleno)}
          >
            {filterRozbaleno ? <Cross2Icon /> : <MixerHorizontalIcon />}
          </IconButton>
        </Flex>

        <TextField.Root
          placeholder="Hledat..."
          value={hledani}
          onChange={(e) => setHledani(e.target.value)}
          mb={filterRozbaleno ? "3" : "0"}
        >
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>

        {filterRozbaleno && (
          <>
            <SegmentedControl.Root
              value={filterStatus}
              onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}
              mb="3"
              style={{ width: "100%" }}
            >
              <SegmentedControl.Item value="vše">Vše</SegmentedControl.Item>
              <SegmentedControl.Item value="aktivní">
                Aktivní
              </SegmentedControl.Item>
              <SegmentedControl.Item value="ukončená">
                Ukončená
              </SegmentedControl.Item>
            </SegmentedControl.Root>

            <Flex gap="1" mb="3" justify="center">
              {DNY.map((den, i) => (
                <Flex
                  key={i}
                  align="center"
                  justify="center"
                  onClick={() => setFilterDen(filterDen === i ? null : i)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor:
                      filterDen === i ? "var(--accent-9)" : "var(--gray-3)",
                    color: filterDen === i ? "white" : "var(--gray-8)",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  {den}
                </Flex>
              ))}
            </Flex>

            <SegmentedControl.Root
              value={order}
              onValueChange={(v) => setOrder(v as typeof order)}
              mb="4"
              style={{ width: "100%" }}
            >
              <SegmentedControl.Item value="abc_sestupne">
                A→Z
              </SegmentedControl.Item>
              <SegmentedControl.Item value="abc_vzestupne">
                Z→A
              </SegmentedControl.Item>
              <SegmentedControl.Item value="den">Dle dne</SegmentedControl.Item>
            </SegmentedControl.Root>
          </>
        )}
      </Box>

      <Box p="4" style={{ overflowY: "auto", flex: 1 }}>
        <Flex direction="column" gap="3">
          {zobrazeneStavby.length === 0 ? (
            <Text align="center" color="gray">
              Žádná stavba neodpovídá filtru
            </Text>
          ) : (
            zobrazeneStavby.map((stavba) => (
              <StavbaItem
                key={stavba.id}
                stavba={stavba}
                onNovyZapis={handleNovyZapis}
                openPopoverId={openPopoverId}
                setOpenPopoverId={setOpenPopoverId}
              />
            ))
          )}
        </Flex>
      </Box>
    </Box>
  );
}

export default SeznamStavebScreen;
