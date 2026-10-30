import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Box, Text } from "@radix-ui/themes";
import { useState, useRef } from "react";

function FotoGalerie({
  fotky,
  onChange,
}: {
  fotky: string[];
  onChange: (fotky: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [nahledIndex, setNahledIndex] = useState<number | null>(null);

  const handleVyber = (e) => {
    const soubory = Array.from(e.target.files ?? []);
    const noveUrl = soubory.map((s) => URL.createObjectURL(s));
    onChange([...fotky, ...noveUrl]);
    e.target.value = "";
  };

  const odstranit = (index: number) => {
    onChange(fotky.filter((_, i) => i !== index));
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleVyber}
        style={{ display: "none" }}
      />

      <Flex gap="2" style={{ overflowX: "auto", paddingBottom: 4 }}>
        {fotky.map((url, i) => (
          <Box
            key={url}
            style={{
              position: "relative",
              flexShrink: "0",
              width: "96",
              height: "96",
            }}
          >
            <img
              src={url}
              alt={`foto ${i + 1}`}
              onClick={() => setNahledIndex(i)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "var(--radius-3)",
                cursor: "pointer",
              }}
            />
            <IconButton
              size="1"
              color="red"
              variant="solid"
              radius="full"
              onClick={() => odstranit(i)}
              style={{ position: "absolute", top: 4, right: 4 }}
            >
              <Cross2Icon />
            </IconButton>
          </Box>
        ))}

        <Flex
          align="center"
          justify="center"
          onClick={() => inputRef.current?.click()}
          style={{
            flexShrink: 0,
            width: 96,
            height: 96,
            border: "2px dashed var(--gray-7)",
            borderRadius: "var(--radius-3)",
            cursor: "pointer",
            color: "var(--gray-9)",
          }}
        >
          <PlusIcon width="28" height="28" />
        </Flex>
      </Flex>

      {fotky.length === 0 && (
        <Text size="1" color="gray">
          Zatím žádné fotky
        </Text>
      )}

      {nahledIndex !== null && (
        <Flex
          direction="column"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "black",
            zIndex: 1000,
          }}
        >
          <Flex justify="between" align="center" p="3">
            <Text style={{ color: "white" }}>
              {nahledIndex + 1} / {fotky.length}
            </Text>
            <IconButton variant="ghost" onClick={() => setNahledIndex(null)}>
              <Cross2Icon color="white" />
            </IconButton>
          </Flex>

          <Flex
            style={{
              flex: 1,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
            }}
            ref={(r) => {
              if (r) {
                r.scrollLeft = nahledIndex * r.clientWidth;
              }
            }}
          >
            {fotky.map((url) => (
              <Flex
                key={url}
                align="center"
                justify="center"
                style={{ flex: "0 0 100%", scrollSnapAlign: "center" }}
              >
                <img
                  src={url}
                  alt=""
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default FotoGalerie;
