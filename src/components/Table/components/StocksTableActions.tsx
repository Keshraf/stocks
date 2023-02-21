import { Button } from "@mantine/core";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import { FiEdit } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { resetSelectedStocks } from "~/store/selectedStocks";
import { trpc } from "~/utils/trpc";
import { toast } from "react-hot-toast";
import { TRPCFetch } from "@trpc/client";
import { StockUpdate, StockUpdateSchema } from "~/types/stocks";

const Wrapper = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  gap: "10px",
  padding: "10px",
  backgroundColor: "$white",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  position: "absolute",
  zIndex: "5",
  bottom: "10px",
  boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.1)",
});

type Props = {
  refetch: any;
};

const StockTableActions = ({ refetch }: Props) => {
  const selectStocks = useAppSelector((state) => state.selectedStocks);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { mutateAsync: updateStocks } =
    trpc.stocks.updateStocksQuantity.useMutation();

  if (selectStocks.length === 0) {
    return <></>;
  }

  const transferStocks = (from: "ordered" | "transit") => {
    let to: "transit" | "quantity" = "quantity";
    if (from === "ordered") {
      to = "transit";
    }
    const data: StockUpdate[] = selectStocks.map((stock) => {
      return {
        id: stock.id,
        from,
        to,
        quantity: stock[from],
      };
    });

    const result = StockUpdateSchema.safeParse(data);

    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      const updatePromise = updateStocks(data);

      toast.promise(updatePromise, {
        loading: "Updating stocks...",
        success: "Stocks updated successfully",
        error: "Error updating stocks",
      });

      updatePromise
        .then(() => {
          dispatch(resetSelectedStocks());
          refetch();
        })
        .catch(() => {
          dispatch(resetSelectedStocks());
        });
    }
  };

  return (
    <Wrapper>
      <Button
        radius="md"
        variant="light"
        color="red"
        onMouseEnter={(e) => {
          e.currentTarget.innerHTML = "Clear";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.innerText = selectStocks.length.toString();
        }}
        onClick={() => {
          dispatch(resetSelectedStocks());
        }}
      >
        {selectStocks.length}
      </Button>
      <Button
        leftIcon={<FiEdit size={18} />}
        radius="md"
        variant="light"
        color="violet"
        onClick={() => {
          router.push("/mills/transfer");
        }}
      >
        Change
      </Button>

      <Button
        onClick={() => transferStocks("transit")}
        radius="md"
        variant="light"
        color="orange"
      >
        Godown ← Transit
      </Button>
      <Button
        radius="md"
        variant="light"
        color="indigo"
        onClick={() => transferStocks("ordered")}
      >
        Transit ← Ordered
      </Button>
    </Wrapper>
  );
};

export default StockTableActions;
