import { Button } from "@mantine/core";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import { TbPackgeImport, TbPackgeExport } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { resetSelectedStock } from "~/store/selectedStock";

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

const StockTableActions = () => {
  const selectStock = useAppSelector((state) => state.selectedStock);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (selectStock.length === 0) {
    return <></>;
  }

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
          e.currentTarget.innerText = selectStock.length.toString();
        }}
        onClick={() => {
          dispatch(resetSelectedStock());
        }}
      >
        {selectStock.length}
      </Button>
      <Button
        leftIcon={<TbPackgeImport size={18} />}
        radius="md"
        variant="light"
        color="indigo"
        onClick={() => router.push("/stocks/add")}
      >
        Add Stock
      </Button>
      <Button
        leftIcon={<TbPackgeExport size={18} />}
        radius="md"
        variant="light"
        color="orange"
      >
        Place Order
      </Button>
    </Wrapper>
  );
};

export default StockTableActions;
