import { Button, DropdownMenu } from "@radix-ui/themes";

function AddZavadaButton({ onBezFotky }: { onBezFotky?: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button size="4" variant="soft" style={{ width: "100%" }}>
          +
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        <DropdownMenu.Item disabled>Fotoaparát</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Galerie</DropdownMenu.Item>
        <DropdownMenu.Item onSelect={onBezFotky}>Bez Fotky</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default AddZavadaButton;
