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
  changeStringStocks,
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

  const StockData: StockConfig[] = [
    {
      title: "Mill Name",
      value: stock.millName,
    },
    {
      title: "Quality",
      value: stock.qualityName,
    },
    {
      title: "Breadth",
      value: stock.breadth,
    },
    {
      title: "Length",
      value: stock.length ? stock.length : "0",
    },
    {
      title: "Weight",
      value: stock.weight,
    },
    {
      title: "GSM",
      value: stock.gsm,
    },
    {
      title: "Sheets",
      value: stock.sheets,
    },
  ];

  const StockStats: StockConfig[] = [
    {
      title: "Godown",
      value: stock.quantity,
    },
    {
      title: "Transit",
      value: stock.transit,
    },
    {
      title: "Ordered",
      value: stock.ordered,
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

  const updateStockHandler = () => {
    if (stock.amount > maxValue) {
      toast.error("Amount cannot be greater than max value");
      return;
    }

    const from =
      stock.from === "Godown"
        ? "quantity"
        : stock.from === "Transit"
        ? "transit"
        : "ordered";
    const to =
      stock.to === "Godown"
        ? "quantity"
        : stock.to === "Transit"
        ? "transit"
        : "ordered";

    const data: StockUpdate = {
      id: stock.id,
      from,
      to,
      quantity: stock.amount,
    };

    const result = StockUpdateSchema.safeParse(data);

    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      const updatePromise = updateStock([data]);

      toast.promise(updatePromise, {
        loading: "Updating stocks...",
        success: "Stocks updated successfully",
        error: "Error updating stocks",
      });

      updatePromise
        .then(() => {
          dispatch(removeStocks(stock.id));
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const optionChangeHandler = (value: string, dir: "from" | "to") => {
    if (value === "Godown" || value === "Transit" || value === "Ordered") {
      if (dir === "from") {
        if (stock.to !== value) {
          dispatch(
            changeStringStocks({ id: stock.id, type: "from", value: value })
          );
        }
      } else {
        if (stock.from !== value) {
          dispatch(
            changeStringStocks({ id: stock.id, type: "to", value: value })
          );
        }
      }
    }
  };

  useEffect(() => {
    if (stock.from === "Godown") {
      setMaxValue(stock.quantity);
    } else if (stock.from === "Transit") {
      setMaxValue(stock.transit);
    } else if (stock.from === "Ordered") {
      setMaxValue(stock.ordered);
    }
  }, [stock.from, stock.quantity, stock.transit, stock.ordered]);

  return (
    <StockWrapper>
      <Text type="LargeSemibold">{"Details"}</Text>
      <InfoWrapper>
        {StockData.map((data, index) => {
          return (
            <InfoRow key={stock.id + "inforow" + index}>
              <Text width="100px" type="MediumRegular">
                {data.title}
              </Text>
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      <Text type="LargeSemibold">{"Quantity"}</Text>
      <InfoWrapper>
        {StockStats.map((data, index) => {
          return (
            <InfoRow key={stock.id + "inforow" + index}>
              <Text width="100px" type="MediumRegular">
                {data.title}
              </Text>
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      <InputGroup>
        <InputWrapper>
          <NativeSelect
            data={["Godown", "Transit", "Ordered"]}
            label="From"
            value={stock.from}
            onChange={(e) => optionChangeHandler(e.currentTarget.value, "from")}
            withAsterisk
          />
        </InputWrapper>
        <IconWrapper>
          <BiArrowFromLeft size={18} color={"#000"} />
        </IconWrapper>
        <InputWrapper>
          <NativeSelect
            data={["Godown", "Transit", "Ordered"]}
            label="To"
            value={stock.to}
            onChange={(e) => optionChangeHandler(e.currentTarget.value, "to")}
            withAsterisk
          />
        </InputWrapper>
      </InputGroup>
      <InputWrapper>
        <NumberInput
          withAsterisk
          label="Amount"
          max={maxValue}
          placeholder="Enter Amount"
          precision={0}
          value={stock.amount}
          onChange={(value) => {
            if (!value) return;
            dispatch(
              changeNumberStocks({
                type: "amount",
                value,
                id: stock.id,
              })
            );
          }}
        />
      </InputWrapper>
      <Button onClick={updateStockHandler} type="submit">
        Update
      </Button>
      <DividerWrapper />
    </StockWrapper>
  );
};

export default StockChange;
