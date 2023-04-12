import { Button } from "@mantine/core";
import { styled } from "stitches.config";
import {
  TbPackgeImport,
  TbPackgeExport,
  TbFileInvoice,
  TbTruck,
} from "react-icons/tb";
import { useAppDispatch, useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { clearOrder } from "~/store/selectedOrder";
import { trpc } from "~/utils/trpc";
import { toast } from "react-hot-toast";

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
  activeTab: string;
  refetch: any;
};

const OrderTableActions = ({ refetch, activeTab }: Props) => {
  const selectOrder = useAppSelector((state) => state.selectedOrder);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { mutateAsync: shiftOrder } = trpc.orders.shiftOrder.useMutation();

  if (selectOrder.length === 0) {
    return <></>;
  }

  const shiftOrderHandler = async (status: "billed" | "shipped") => {
    if (activeTab !== "pending" && activeTab !== "billed")
      return toast.error("Select a Tab");

    const ShiftPromise = shiftOrder({
      ids: selectOrder,
      to: status,
      from: activeTab,
    });

    toast.promise(ShiftPromise, {
      loading: "Shifting...",
      success: "Shifted",
      error: "Error",
    });
    await ShiftPromise.then(() => {
      refetch();
      dispatch(clearOrder());
    });
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
          e.currentTarget.innerText = selectOrder.length.toString();
        }}
        onClick={() => {
          dispatch(clearOrder());
        }}
      >
        {selectOrder.length}
      </Button>
      <Button
        leftIcon={<TbFileInvoice size={18} />}
        radius="md"
        variant="light"
        color="indigo"
        onClick={() => shiftOrderHandler("billed")}
      >
        Bill
      </Button>
      <Button
        leftIcon={<TbTruck size={18} />}
        radius="md"
        variant="light"
        color="orange"
        onClick={() => shiftOrderHandler("shipped")}
      >
        Ship
      </Button>
    </Wrapper>
  );
};

export default OrderTableActions;
