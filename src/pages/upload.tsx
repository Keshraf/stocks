import { FileInput } from "@mantine/core";
import { styled, theme } from "stitches.config";
import { Input } from "~/components/UI/Input";
import Text from "~/components/UI/Text";
import { RiFileExcel2Fill } from "react-icons/ri";
import { FormEvent, useState } from "react";
import { Button, ActionButton } from "~/components/UI/Buttons";
import { read, utils, type WorkBook } from "xlsx";
import { Stock, StockArrSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";
import Head from "next/head";

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

const InputContainer = styled("form", {
  width: "auto",
  center: true,
  gap: "$gapMedium",
});

interface DataItem {
  name: string;
  quantity: number;
  packets: number;
}

const Upload = () => {
  const [value, setValue] = useState<File | null>(null);
  const sendStocks = trpc.stocks.postStocksBulk.useMutation();

  /* function getSpecs(str: string) {
    const splitStr = str.split(" ");
    let mill: string = "";
    let qualityName: string = "";
    let breadth: number = 0;
    let length: number = 0;
    let weight: number = 0;
    let gsm: number = 0;
    let sheets: number = 0;
    let bundle: number = 0;

    splitStr.forEach((val, index) => {
      // First is always Mill
      if (index === 0) {
        mill = val;
      }
      // Dissects the KG String
      else if (val.includes("KG") && val.includes("-")) {
        // Splits size & KG
        const s = val.split("-");
        if (s.length > 0 && s[0]) {
          if (s[0].includes("X")) {
            // Splits the SIZE str
            const size = s[0].split("X");
            // Gets breadth & length
            if (size.length === 2 && size[0] && size[1]) {
              breadth = Number(size[0]);
              length = Number(size[1]);
            }
            // Just gets the Breadth
            else if (size[0]) {
              breadth = Number(size[0]);
            }
          }
        }

        // Gets the KG
        if (s[1]) {
          weight = Number(s[1].substring(0, s[1].length - 2));
        }
      } else if (
        (val.includes("G") && index === splitStr.length - 2) ||
        index === splitStr.length - 3
      ) {
        gsm = Number(val.substring(0, val.length - 1));
      } else if (
        (val.includes("S") && index === splitStr.length - 1) ||
        index === splitStr.length - 2
      ) {
        sheets = Number(val.substring(0, val.length - 1));
      } else if (val.includes("B") && index === splitStr.length - 1) {
        bundle = Number(val.substring(3, val.length - 1));
      } else {
        qualityName = qualityName.concat(val, " ");
      }
    });

    return {
      gsm,
      sheets,
      breadth,
      length,
      weight,
      qualityName: qualityName.trim(),
      bundle,
      mill,
    };
  }

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!value) {
      return;
    }
    console.log(e);
    const f = await value.arrayBuffer();
    const wb: WorkBook = read(f);

    const data = utils
      // @ts-ignore
      .sheet_to_json<DataItem>(wb.Sheets[wb.SheetNames[0]], {
        header: ["name", "quantity", "packets"],
      });

    const formatedData: Stock[] = data
      .slice(13, data.length - 1)
      .map((item: DataItem, index) => {
        const specs = getSpecs(item.name);

        return {
          ...specs,
          quantity: item.packets,
        };
      });

    console.log(StockArrSchema.safeParse(formatedData));
    console.log(formatedData);
    const response = await sendStocks.mutateAsync(formatedData);

    console.log("Response", response);
  }; */
  return (
    <>
      <Main>
        <Text type="LargeBold">Upload</Text>
        <InputContainer /* onSubmit={submitHandler} */>
          <FileInput
            icon={
              <RiFileExcel2Fill size={18} color={theme.colors.content.value} />
            }
            value={value}
            onChange={setValue}
            onDrop={(e) => console.log(e)}
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
            disabled={value ? false : true}
            type="submit"
          >
            Upload File
          </ActionButton>
        </InputContainer>
      </Main>
    </>
  );
};

export default Upload;
