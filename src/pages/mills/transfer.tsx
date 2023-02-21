import { styled } from "stitches.config";
import StockChange from "~/components/ChangeGroup/StockChange";
import Text from "~/components/UI/Text";
import { useAppSelector } from "~/store";

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

const MillTransferPage = () => {
  const selectedStocks = useAppSelector((state) => state.selectedStocks);

  return (
    <Wrapper>
      <Text>Stock Transfer Page</Text>
      {selectedStocks.map((stock) => {
        return <StockChange key={stock.id} stock={stock} />;
      })}
    </Wrapper>
  );
};

export default MillTransferPage;
