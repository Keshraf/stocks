import { Button, NumberInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import { removeStock, selectedSchema } from "~/store/selectedStock";
import { AddStockSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";

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
  position: "relative",
  gap: "$gapXLarge",
  overflow: "auto",
});

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
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
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
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

const StockForm = styled("form", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-end",
  gap: "$gapMedium",
});

type formInputData = {
  quantity: number;
  transit: number;
  ordered: number;
  bundle: number;
};

type AddData = selectedSchema & formInputData;

const StockAddPage = () => {
  const selectedStock = useAppSelector((state) => state.selectedStock);
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

  const formData = [
    {
      label: "Bundle",
      placeholder: "Enter Bundle",
      precision: 0,
      name: "bundle",
    },
    {
      label: "In-Stock Godown Packets",
      placeholder: "Enter Godown Packets",
      precision: 0,
      name: "quantity",
    },
    {
      label: "Transit Packets",
      placeholder: "Enter Transit Packets",
      precision: 0,
      name: "transit",
    },
    {
      label: "Ordered Packets",
      placeholder: "Enter Ordered Packets",
      precision: 0,
      name: "ordered",
    },
  ];

  const formSubmitHandler = (
    e: React.FormEvent<HTMLFormElement>,
    stock: selectedSchema
  ) => {
    e.preventDefault();

    const formEntries = Object.entries(e.target);
    console.log(formEntries);
    const data: formInputData = {
      /* @ts-ignore */
      bundle: formEntries[0][1].value as number,
      /* @ts-ignore */
      quantity: formEntries[3][1].value as number,
      /* @ts-ignore */
      transit: formEntries[6][1].value as number,
      /* @ts-ignore */
      ordered: formEntries[9][1].value as number,
    };

    addStockHandler({
      ...stock,
      ...data,
    });
  };

  const addStockHandler = async (data: AddData) => {
    const stock = {
      mill: data.millName,
      qualityName: data.qualityName,
      breadth: Number(data.breadth),
      length: Number(data.length),
      quantity: Number(data.quantity),
      gsm: Number(data.gsm),
      bundle: Number(data.bundle),
      sheets: Number(data.sheets),
      weight: Number(data.weight),
      transit: Number(data.transit),
      ordered: Number(data.ordered),
    };

    const result = AddStockSchema.safeParse(stock);
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
        dispatch(removeStock(data.id));
      });
    }
  };

  return (
    <Main>
      <Text>Stock Add Page</Text>
      {selectedStock.map((stock, index) => {
        return (
          <StockWrapper key={`${stock.id}_${index}`}>
            <InfoWrapper>
              {StockData.map((data, index) => {
                return (
                  <InfoRow key={stock.id + "inforow" + index}>
                    <Text width="100px" type="MediumMedium">
                      {data.title}
                    </Text>
                    <Text type="MediumRegular">{stock[data.key]}</Text>
                  </InfoRow>
                );
              })}
            </InfoWrapper>
            <StockForm onSubmit={(e) => formSubmitHandler(e, stock)}>
              {formData.map((input) => {
                return (
                  <InputWrapper key={input.label + index}>
                    <Text type="MediumSemibold">{input.label}</Text>
                    <NumberInput
                      defaultValue={0}
                      name={input.name}
                      placeholder={input.placeholder}
                      step={0.5}
                      precision={input.precision}
                    />
                  </InputWrapper>
                );
              })}
              <Button type="submit">Submit</Button>
            </StockForm>
            <DividerWrapper />
          </StockWrapper>
        );
      })}
    </Main>
  );
};

export default StockAddPage;
