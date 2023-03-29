import { styled } from "stitches.config";
import Text from "../UI/Text";
import { Autocomplete, Button, NumberInput, TextInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import {
  type selectedAddStockSchema,
  updateAddStockById,
  removeAddStockById,
} from "~/store/selectedAddStock";
import { useEffect, useState } from "react";
import { AddStockSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";
import { useAppDispatch } from "~/store";
import { type } from "os";

const InfoRow = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

type StockConfig = {
  title: string;
  value: string;
  width: string;
  color?: string;
};

const StockWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapLarge",
});

const InfoWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  overflowX: "auto",
  overflowY: "hidden",
});

type Props = {
  stock: selectedAddStockSchema;
  clientList: string[];
  index: number;
};

type FormDataType = {
  label: string;
  placeholder: string;
  precision: number;
  name: "godownOrder" | "clientOrder" | "rate";
  value: number;
};

type UpdateStock =
  | {
      value: string;
      type: "client" | "invoice";
    }
  | {
      value: number;
      type: "godownOrder" | "clientOrder" | "rate";
    };

const StockAdd = ({ stock, clientList, index }: Props) => {
  const dispatch = useAppDispatch();
  /* const { mutateAsync: addStock } = trpc.stocks.addStock.useMutation(); */

  const StockData: StockConfig[] = [
    {
      title: "Mill Name",
      value: stock.millName,
      width: "30px",
    },
    {
      title: "Quality",
      value: stock.qualityName,
      width: "70px",
    },
    {
      title: "Size",
      value: `${stock.breadth}X${stock.length}`,
      width: "70px",
    },
    {
      title: "Weight",
      value: `${stock.weight}KG`,
      width: "50px",
    },
    {
      title: "GSM",
      value: `${stock.gsm}G`,
      width: "50px",
    },
    {
      title: "Sheets",
      value: `${stock.sheets}S`,
      width: "50px",
    },
  ];

  const formNumberData: FormDataType[] = [
    {
      label: "Godown Order",
      placeholder: "Godown",
      precision: 0,
      name: "godownOrder",
      value: stock.godownOrder,
    },
    {
      label: "Client Order",
      placeholder: "Client",
      precision: 0,
      name: "clientOrder",
      value: stock.clientOrder,
    },
    {
      label: "Rate",
      placeholder: "Rate",
      precision: 1,
      name: "rate",
      value: stock.rate,
    },
  ];

  /*   const addStockHandler = async () => {
    const data = {
      mill: stock.millName,
      qualityName: stock.qualityName,
      breadth: Number(stock.breadth),
      length: Number(stock.length),
      gsm: Number(stock.gsm),
      sheets: Number(stock.sheets),
      weight: Number(stock.weight),
      invoice: stock.invoice,
      client: stock.client,
    };

    const result = AddStockSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);
      const AddStockPromise = addStock(result.data);

      toast.promise(AddStockPromise, {
        loading: "Adding Stock...",
        success: "Stock Added",
        error: "Error Adding Stock",
      });

      AddStockPromise.then(() => {
        dispatch(removeSpecs(stock.id));
      }).catch(() => {
        console.log("Error");
      });
    }
  }; */

  const updateStockById = ({ value, type }: UpdateStock) => {
    dispatch(
      updateAddStockById({
        ...stock,
        [type]: value,
      })
    );
  };

  return (
    <StockWrapper>
      <InfoWrapper>
        {StockData.map((data, index) => {
          return (
            <InfoRow
              css={{ width: data.width }}
              key={stock.id + "inforow" + index}
            >
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}
        {formNumberData.map((input, index) => {
          return (
            <InfoRow css={{ width: "100px" }} key={input.label + index}>
              <NumberInput
                min={0}
                value={input.value}
                onChange={(value) => {
                  if (value !== undefined) {
                    updateStockById({ value, type: input.name });
                  }
                }}
                defaultValue={0}
                name={input.name}
                placeholder={input.placeholder}
                precision={input.precision}
              />
            </InfoRow>
          );
        })}
        <InfoRow css={{ width: "150px" }}>
          <Autocomplete
            value={stock.client}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => {
              if (value) {
                updateStockById({ value, type: "client" });
              }
            }}
            placeholder="Choose Client"
            data={clientList}
          />
        </InfoRow>
        <InfoRow css={{ width: "150px" }}>
          <TextInput
            value={stock.invoice}
            onChange={(value) => {
              if (value.target.value) {
                updateStockById({ value: value.target.value, type: "invoice" });
              }
            }}
            placeholder="Enter Order No."
          />
        </InfoRow>
      </InfoWrapper>
    </StockWrapper>
  );
};

export default StockAdd;
