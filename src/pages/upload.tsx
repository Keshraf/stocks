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
import { BulkStockSchema, BulkStockSchemaArr } from "~/types/bulk";
import { toast } from "react-hot-toast";

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

interface ClientItem {
  sr: string;
  name: string;
}

const Upload = () => {
  const [value, setValue] = useState<File | null>(null);
  const [secondValue, setSecondValue] = useState<File | null>(null);
  /* const sendStocks = trpc.stocks.postStocksBulk.useMutation(); */
  const { mutateAsync: addStock } = trpc.stocks.addStock.useMutation();
  const { mutateAsync: addClients } = trpc.clients.addBulkClient.useMutation();

  function getSpecs(str: string) {
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
      mill,
    };
  }

  const uploadStocksHandler = async (e: FormEvent) => {
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

    const slicedData = data.slice(13, data.length - 1);
    console.log("Response", slicedData);

    const formattedData = slicedData.map((item: DataItem, index) => {
      const specs = getSpecs(item.name);

      return {
        ...specs,
        quantity: item.packets,
        invoice: "001",
        rate: 0,
      };
    });

    console.log("Response", formattedData);

    const results = BulkStockSchemaArr.safeParse(formattedData);

    // divide an array into arrays of array of size 10
    const chunk = (arr: any[], size: number) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    };

    const chunkedArr = chunk(formattedData, 10);

    if (results.success) {
      for (let index = 0; index < chunkedArr.length; index++) {
        const element = chunkedArr[index];
        if (!element) continue;
        await addStock(element)
          .then((res) => {
            toast.success("Stocks Added Successfully");
          })
          .catch((err) => {
            toast.error("Error Adding Stocks");
          });
      }
    }
  };

  const clientUploadhandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!secondValue) {
      return;
    }
    console.log(e);
    const f = await secondValue.arrayBuffer();
    const wb: WorkBook = read(f);

    const data = utils
      // @ts-ignore
      .sheet_to_json<ClientItem>(wb.Sheets[wb.SheetNames[0]], {
        header: ["sr", "name"],
      });

    const slicedData = data.slice(1).map((item) => item.name);

    const chunk = (arr: any[], size: number) => {
      return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    };

    const chunkedArr = chunk(slicedData, 10);

    for (let index = 0; index < chunkedArr.length; index++) {
      const element = chunkedArr[index];
      if (!element) continue;
      await addClients(element)
        .then((res) => {
          toast.success("Clients Added Successfully");
        })
        .catch((err) => {
          toast.error("Error Adding Clients");
        });
    }
  };

  const stocks = [
    {
      gsm: 370,
      sheets: 100,
      breadth: 51,
      length: 53.5,
      weight: 10.1,
      qualityName: "AG",
      mill: "TN",
      quantity: 214,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 370,
      sheets: 100,
      breadth: 53.5,
      length: 101.5,
      weight: 20.1,
      qualityName: "AG",
      mill: "TN",
      quantity: 164,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 320,
      sheets: 100,
      breadth: 66,
      length: 101.5,
      weight: 21.4,
      qualityName: "AG",
      mill: "TN",
      quantity: 105,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 380,
      sheets: 100,
      breadth: 66,
      length: 61,
      weight: 15.3,
      qualityName: "AG",
      mill: "TN",
      quantity: 204,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 290,
      sheets: 100,
      breadth: 66.5,
      length: 98,
      weight: 18.9,
      qualityName: "APM",
      mill: "TN",
      quantity: 138,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 350,
      sheets: 100,
      breadth: 86.5,
      length: 73.5,
      weight: 22.3,
      qualityName: "APM",
      mill: "TN",
      quantity: 10,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 230,
      sheets: 144,
      breadth: 63.5,
      length: 76,
      weight: 16,
      qualityName: "LWC",
      mill: "UNI",
      quantity: 14,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 230,
      sheets: 144,
      breadth: 81,
      length: 66,
      weight: 17.7,
      qualityName: "LWC",
      mill: "UNI",
      quantity: 42,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 180,
      sheets: 144,
      breadth: 96.5,
      length: 61,
      weight: 15.3,
      qualityName: "LWC",
      mill: "UNI",
      quantity: 58.5,
      invoice: "001",
      rate: 0,
    },
    {
      gsm: 230,
      sheets: 144,
      breadth: 106,
      length: 72,
      weight: 25.3,
      qualityName: "PDB",
      mill: "UNI",
      quantity: 14,
      invoice: "001",
      rate: 0,
    },
  ];

  return (
    <>
      <Main>
        <Text type="LargeBold">Upload</Text>
        <InputContainer onSubmit={uploadStocksHandler}>
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
            Upload Stock File
          </ActionButton>
        </InputContainer>
        <InputContainer onSubmit={clientUploadhandler}>
          <FileInput
            icon={
              <RiFileExcel2Fill size={18} color={theme.colors.content.value} />
            }
            value={secondValue}
            onChange={setSecondValue}
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
            status={secondValue ? "active" : "inactive"}
            disabled={secondValue ? false : true}
            type="submit"
          >
            Upload Client File
          </ActionButton>
        </InputContainer>
      </Main>
    </>
  );
};

export default Upload;
