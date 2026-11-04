import { Flex, Checkbox, Text } from "@radix-ui/themes";

function CheckboxPole({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Text as="label" size="3">
      <Flex gap="2" align="center">
        <Checkbox
          checked={checked}
          onCheckedChange={(v: boolean | "indeterminate") =>
            onChange(v === true)
          }
        />
        {label}
      </Flex>
    </Text>
  );
}

export default CheckboxPole;
