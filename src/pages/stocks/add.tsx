import { Button, Loader, NumberInput } from "@mantine/core";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import StockAdd from "~/components/StockAdd";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import { removeStock, selectedSchema } from "~/store/selectedStock";
import { AddStockSchema } from "~/types/stocks";
import { trpc } from "~/utils/trpc";

const Wrapper = styled("main", {
  width: "100%",
  height: "stretch",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapXLarge",
  variants: {
    direction: {
      center: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
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

  const { data: clientData, isLoading: clientLoading } =
    trpc.clients.getClients.useQuery();

  if (!clientData || clientLoading) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  const getClientNames = () => {
    const clientNames: string[] = [];
    clientData.forEach((client) => clientNames.push(client.name));
    return clientNames;
  };

  return (
    <Wrapper>
      <Text>Stock Add Page</Text>
      {selectedStock.map((stock, index) => {
        return (
          <StockAdd
            key={stock.id + index}
            stock={stock}
            clientList={getClientNames()}
          />
        );
      })}
    </Wrapper>
  );
};

export default StockAddPage;
