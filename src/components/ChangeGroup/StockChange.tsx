import { styled } from "stitches.config";
import Text from "../UI/Text";
import {
  Autocomplete,
  Button,
  NativeSelect,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { toast } from "react-hot-toast";
import {
  removeStocks,
  type SelectedStocksSchema,
  type InitialState,
  changeNumberStocks,
} from "~/store/selectedStocks";
import { useEffect, useMemo, useState } from "react";
import { AddStockSchema, StockUpdate, StockUpdateSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";
import { useAppDispatch } from "~/store";
import { BiArrowFromLeft, BiArrowFromRight } from "react-icons/bi";

const InfoRow = styled("div", {
  width: "fit-content",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const InputWrapper = styled("div", {
  width: "30%",
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

const IconWrapper = styled("div", {
  width: "auto",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

type StockConfig = {
  title: string;
  value: string | number;
  width: string;
};

type InputConfig = {
  title: string;
  key: "changedQuantity" | "changedTransit" | "changedOrdered";
  value: number;
  width: string;
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
  stock: InitialState;
};

type FormDataType = {
  label: string;
  placeholder: string;
  precision: number;
  name: "bundle" | "quantity" | "transit" | "ordered";
  value: number;
};

const StockChange = ({ stock }: Props) => {
  const dispatch = useAppDispatch();
  const [maxValue, setMaxValue] = useState<number>(stock.ordered);
  const { mutateAsync: updateStock } =
    trpc.stocks.updateStocksQuantity.useMutation();

  const remaining = useMemo(() => {
    return (
      stock.quantity +
      stock.transit +
      stock.ordered -
      (stock.changedQuantity + stock.changedTransit + stock.changedOrdered)
    );
  }, [stock]);

  const StockData: StockConfig[] = [
    {
      title: "Mill",
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
      value: `${stock.breadth}${stock.length ? ` X ${stock.length}` : ""}`,
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
    {
      title: "Order No.",
      value: stock.invoice,
      width: "150px",
    },
    /* {
      title: "Client",
      value: stock.client ? stock.client : "-",
      width: "150px",
    }, */
    {
      title: "Remaining",
      value: remaining,
      width: "100px",
    },
  ];

  const InputStockData: InputConfig[] = [
    {
      title: "Godown",
      key: "changedQuantity",
      value: stock.changedQuantity,
      width: "100px",
    },
    {
      title: "Transit",
      key: "changedTransit",
      value: stock.changedTransit,
      width: "100px",
    },
    {
      title: "Ordered",
      key: "changedOrdered",
      value: stock.changedOrdered,
      width: "100px",
    },
  ];

  return (
    <StockWrapper>
      <InfoWrapper>
        {StockData.map((data, index) => {
          if (data.title === "Remaining" && (remaining < 0 || remaining > 0))
            return (
              <InfoRow
                css={{ width: data.width }}
                key={stock.id + "inforow" + index}
              >
                <Text type="MediumSemibold" color="$danger">
                  {data.value}
                </Text>
              </InfoRow>
            );

          return (
            <InfoRow
              css={{ width: data.width }}
              key={stock.id + "inforow" + index}
            >
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}
        {InputStockData.map((data, index) => {
          return (
            <InfoRow
              css={{ width: data.width }}
              key={stock.id + "inforow" + index}
            >
              <NumberInput
                placeholder={`Enter ${data.title}`}
                defaultValue={0}
                precision={0}
                min={0}
                value={data.value}
                onChange={(value) => {
                  if (value === undefined || value === null) return;
                  dispatch(
                    changeNumberStocks({
                      type: data.key,
                      value,
                      id: stock.id,
                    })
                  );
                }}
              />
            </InfoRow>
          );
        })}
      </InfoWrapper>
    </StockWrapper>
  );
};

export default StockChange;
