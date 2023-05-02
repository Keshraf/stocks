import {
  TableItem,
  TableRow,
  TableHead,
  TableBody,
  TableWrapper,
  TableHeadItem,
} from "./elements";

import { ImportedOrderType } from "~/types/orders";
import Text from "../UI/Text";
import { styled } from "stitches.config";
import { Button, Checkbox, Modal, NumberInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { type OrderDetails } from "~/pages/orders/[id]";
import { TbEdit, TbTrash } from "react-icons/tb";
import { trpc } from "~/utils/trpc";
import { toast } from "react-hot-toast";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  overflow: "scroll",
});

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
  gap: "10px",
  overflowX: "auto",
  overflowY: "hidden",
});

const InfoRow = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const Form = styled("form", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

interface Headers {
  name: string;
  value: string | number;
  width: string;
}

type StockConfig = {
  title: string;
  value: string;
  width: string;
  color?: string;
  align?: "left" | "right" | "center";
};

const OrderDetailTable = ({
  data,
  refetch,
}: {
  data: OrderDetails;
  refetch: () => void;
}) => {
  const [opened, setOpened] = useState(false);

  const { mutateAsync: updateStockOrder } =
    trpc.orders.updateStockOrder.useMutation();

  const router = useRouter();
  const StockData: StockConfig[] = [
    {
      title: "Mill Name",
      value: data.millName,
      width: "100px",
    },
    {
      title: "Quality",
      value: data.qualityName,
      width: "150px",
    },
    {
      title: "Size",
      value: `${data.breadth}X${data.length}`,
      width: "70px",
    },
    {
      title: "Weight",
      value: `${data.weight}KG`,
      width: "70px",
    },
    {
      title: "GSM",
      value: `${data.gsm}G`,
      width: "70px",
    },
    {
      title: "Sheets",
      value: `${data.sheets}S`,
      width: "70px",
    },
    {
      title: "Rate",
      value: `₹${data.rate}`,
      width: "70px",
    },
    {
      title: "Pending",
      value: `${data.pending}`,
      width: "100px",
      align: "right",
    },
    {
      title: "Billed",
      value: `${data.billed}`,
      width: "100px",
      align: "right",
    },
    {
      title: "Shipped",
      value: `${data.shipped}`,
      width: "100px",
      align: "right",
    },
  ];

  const rowClickHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string
  ) => {
    if (e.target instanceof HTMLInputElement) return;

    router.push(`/orders/${id}`);
  };

  const updateOrderHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [rate, pending, billed, shipped] = Object.values(e.target)
      .filter((value) => value instanceof HTMLInputElement)
      .map((value) => value.value);

    const updateData = {
      id: data.id,
      rate: Number(rate),
      pending: Number(pending),
      billed: Number(billed),
      shipped: Number(shipped),
    };

    console.log(updateData);

    const UpdateStockOrderPromise = updateStockOrder(updateData);
    toast.promise(UpdateStockOrderPromise, {
      loading: "Updating Order...",
      success: "Order Updated",
      error: "Error Updating Order",
    });

    await UpdateStockOrderPromise.then(async () => {
      refetch();
      setOpened(false);
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Update Order Item"
        centered
      >
        <Form onSubmit={updateOrderHandler}>
          {StockData.map((value, index) => {
            if (index < 6) return null;
            let val = Number(value.value);
            if (value.title === "Rate") {
              val = Number(value.value.slice(1));
            }
            return (
              <NumberInput
                style={{ width: "100%" }}
                label={value.title}
                defaultValue={val}
                key={index}
              />
            );
          })}
          <Button type="submit" color="blue">
            Submit
          </Button>
        </Form>
      </Modal>
      <StockWrapper>
        <InfoWrapper>
          {StockData.map((value, index) => {
            return (
              <InfoRow
                css={{ width: value.width }}
                key={data.specId + "inforow" + index}
              >
                <Text type="MediumRegular">{value.value}</Text>
              </InfoRow>
            );
          })}
          <Button
            size="xs"
            variant="outline"
            color="blue"
            onClick={() => {
              setOpened(true);
            }}
          >
            <TbEdit size={16} />
          </Button>
          <Button size="xs" variant="outline" color="red" onClick={() => {}}>
            <TbTrash size={16} />
          </Button>
        </InfoWrapper>
      </StockWrapper>
    </>
  );
};

export default OrderDetailTable;
