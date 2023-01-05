import { FileInput } from "@mantine/core";
import { styled, theme } from "stitches.config";
import { Input } from "~/components/UI/Input";
import Text from "~/components/UI/Text";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useState } from "react";
import { Button, ActionButton } from "~/components/UI/Buttons";

const Main = styled("main", {
  width: "100%",
  height: "auto",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapLarge",
});

const InputContainer = styled("div", {
  width: "auto",
  center: true,
  gap: "$gapMedium",
});

const Upload = () => {
  const [value, setValue] = useState<File | null>(null);
  console.log(value);
  return (
    <Main>
      <Text type="LargeBold">Upload</Text>
      <InputContainer>
        <FileInput
          icon={
            <RiFileExcel2Fill size={18} color={theme.colors.content.value} />
          }
          value={value}
          onChange={setValue}
          placeholder="Pick a Excel File"
          accept=".xls,.xlsx"
          clearable
          styles={{
            input: {
              height: "50px",
              borderRadius: theme.radii.roundSmall.value,
              fontFamily: "Poppins",
              color: theme.colors.content.value,
              borderColor: theme.colors.highlight.value,
            },
            placeholder: {
              fontFamily: "Poppins",
              color: theme.colors.content.value,
            },
          }}
        />
        <ActionButton
          status={value ? "active" : "inactive"}
          disabled={value ? true : false}
        >
          Upload File
        </ActionButton>
      </InputContainer>
    </Main>
  );
};

export default Upload;
