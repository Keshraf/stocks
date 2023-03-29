import { Button } from "@mantine/core";
import { styled } from "stitches.config";
import { TbPackgeImport, TbPackgeExport } from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { resetSelectedSpecs } from "~/store/selectedSpecs";
import { addStockSelected } from "~/store/selectedAddStock";

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

const SpecsTableActions = () => {
  const selectSpecs = useAppSelector((state) => state.selectedSpecs);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (selectSpecs.length === 0) {
    return <></>;
  }

  const addStockHandler = () => {
    const selected = selectSpecs.map((spec) => {
      return {
        id: spec.id,
        millName: spec.millName,
        qualityName: spec.qualityName,
        breadth: spec.breadth,
        weight: spec.weight,
        length: spec.length,
        gsm: spec.gsm,
        sheets: spec.sheets,
        godownOrder: 0,
        clientOrder: 0,
        rate: 0,
        client: "",
        invoice: "",
      };
    });

    dispatch(addStockSelected(selected));
    router.push("/stocks/add");
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
          e.currentTarget.innerText = selectSpecs.length.toString();
        }}
        onClick={() => {
          dispatch(resetSelectedSpecs());
        }}
      >
        {selectSpecs.length}
      </Button>
      <Button
        leftIcon={<TbPackgeImport size={18} />}
        radius="md"
        variant="light"
        color="indigo"
        onClick={addStockHandler}
      >
        Add Stock
      </Button>
      <Button
        leftIcon={<TbPackgeExport size={18} />}
        radius="md"
        variant="light"
        color="orange"
        onClick={() => router.push("/orders/add")}
      >
        Place Order
      </Button>
    </Wrapper>
  );
};

export default SpecsTableActions;
