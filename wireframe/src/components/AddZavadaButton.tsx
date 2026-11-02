import { Button, DropdownMenu } from "@radix-ui/themes";
import { useRef } from "react";

function AddZavadaButton({
  onPridat,
}: {
  onPridat?: (foto: string[]) => void;
}) {
  const galerieRef = useRef<HTMLInputElement>(null);
  const fotakRef = useRef<HTMLInputElement>(null);

  const handleVyber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soubory = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (soubory.length === 0) return;
    onPridat?.(soubory.map((s) => URL.createObjectURL(s)));
  };

  return (
    <>
      <input
        ref={galerieRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleVyber}
        style={{ display: "none" }}
      />
      <input
        ref={fotakRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleVyber}
        style={{ display: "none" }}
      />

      <DropdownMenu.Root modal={false}>
        <DropdownMenu.Trigger>
          <Button size="4" variant="soft" style={{ width: "100%" }}>
            +
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          style={{
            width: "var(--radix-dropdown-menu-trigger-width)",
            minWidth: "var(--radix-dropdown-menu-trigger-width)",
          }}
        >
          <DropdownMenu.Item
            onSelect={() => fotakRef.current?.click()}
            style={{ justifyContent: "center" }}
          >
            Fotoaparát
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => galerieRef.current?.click()}
            style={{ justifyContent: "center" }}
          >
            Galerie
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => onPridat?.([])}
            style={{ justifyContent: "center" }}
          >
            Bez fotky
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

export default AddZavadaButton;
