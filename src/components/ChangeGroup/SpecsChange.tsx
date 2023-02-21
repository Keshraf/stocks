import { styled } from "stitches.config";
import Text from "../UI/Text";
import { Autocomplete, Button, NumberInput, TextInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import {
  removeSpecs,
  type InitalState,
  changeNumberSpecs,
  changeStringSpecs,
} from "~/store/selectedSpecs";
import { useEffect, useState } from "react";
import { AddStockSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";
import { useAppDispatch } from "~/store";

const InfoRow = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const InputWrapper = styled("div", {
  width: "100%",
  /* minWidth: "100px", */
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const InputGroup = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-end",
  gap: "$gapMedium",
  /* flexWrap: "wrap", */
});

type StockConfig = {
  title: string;
  key:
    | "millName"
    | "qualityName"
    | "breadth"
    | "length"
    | "weight"
    | "gsm"
    | "sheets";
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
  alignItems: "flex-start",
  gap: "$gapMedium",
  overflowX: "auto",
  overflowY: "hidden",
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

type Props = {
  stock: InitalState;
  clientList: string[];
};

type FormDataType = {
  label: string;
  placeholder: string;
  precision: number;
  name: "bundle" | "quantity" | "transit" | "ordered";
  value: number;
};

const StockAdd = ({ stock, clientList }: Props) => {
  const dispatch = useAppDispatch();
  const { mutateAsync: addStock } = trpc.stocks.addStock.useMutation();

  const StockData: StockConfig[] = [
    {
      title: "Mill Name",
      key: "millName",
    },
    {
      title: "Quality",
      key: "qualityName",
    },
    {
      title: "Breadth",
      key: "breadth",
    },
    {
      title: "Length",
      key: "length",
    },
    {
      title: "Weight",
      key: "weight",
    },
    {
      title: "GSM",
      key: "gsm",
    },
    {
      title: "Sheets",
      key: "sheets",
    },
  ];

  const formNumberData: FormDataType[] = [
    {
      label: "Bundle",
      placeholder: "Enter Bundle",
      precision: 0,
      name: "bundle",
      value: stock.bundle,
    },
    {
      label: "Godown",
      placeholder: "Enter Godown Packets",
      precision: 0,
      name: "quantity",
      value: stock.quantity,
    },
    {
      label: "Transit",
      placeholder: "Enter Transit Packets",
      precision: 0,
      name: "transit",
      value: stock.transit,
    },
    {
      label: "Ordered",
      placeholder: "Enter Ordered Packets",
      precision: 0,
      name: "ordered",
      value: stock.ordered,
    },
  ];

  const addStockHandler = async () => {
    const data = {
      mill: stock.millName,
      qualityName: stock.qualityName,
      breadth: Number(stock.breadth),
      length: Number(stock.length),
      quantity: Number(stock.quantity),
      gsm: Number(stock.gsm),
      bundle: Number(stock.bundle),
      sheets: Number(stock.sheets),
      weight: Number(stock.weight),
      transit: Number(stock.transit),
      ordered: Number(stock.ordered),
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
  };

  return (
    <StockWrapper>
      <InfoWrapper>
        {StockData.map((data, index) => {
          return (
            <InfoRow key={stock.id + "inforow" + index}>
              <Text width="100px" type="MediumRegular">
                {data.title}
              </Text>
              <Text type="MediumSemibold">{stock[data.key]}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      <InputGroup>
        {formNumberData.map((input, index) => {
          return (
            <InputWrapper key={input.label + index}>
              <Text type="MediumSemibold">{input.label}</Text>
              <NumberInput
                min={0}
                value={input.value}
                onChange={(value) => {
                  if (value && value >= 0) {
                    dispatch(
                      changeNumberSpecs({
                        id: stock.id,
                        type: input.name,
                        value,
                      })
                    );
                  }
                }}
                defaultValue={0}
                name={input.name}
                placeholder={input.placeholder}
                step={0.5}
                precision={input.precision}
              />
            </InputWrapper>
          );
        })}
      </InputGroup>
      <InputWrapper>
        <Text type="MediumBold">Invoice</Text>
        <TextInput
          value={stock.invoice}
          onChange={(e) => {
            dispatch(
              changeStringSpecs({
                id: stock.id,
                type: "invoice",
                value: e.target.value.trim(),
              })
            );
          }}
          placeholder="Enter Invoice Code"
        />
      </InputWrapper>
      <InputWrapper>
        <Text type="MediumBold">Client</Text>
        <Autocomplete
          value={stock.client}
          limit={20}
          maxDropdownHeight={300}
          onChange={(value) => {
            dispatch(
              changeStringSpecs({
                id: stock.id,
                type: "client",
                value: value.trim(),
              })
            );
          }}
          placeholder="Choose Client"
          data={clientList}
        />
      </InputWrapper>
      <Button onClick={addStockHandler} type="submit">
        Submit
      </Button>
      <DividerWrapper />
    </StockWrapper>
  );
};

export default StockAdd;
