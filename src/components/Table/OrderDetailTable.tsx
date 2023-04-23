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
import { Button, Checkbox } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { type OrderDetails } from "~/pages/orders/[id]";
import { TbEdit } from "react-icons/tb";

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

const OrderDetailTable = ({ data }: { data: OrderDetails }) => {
  const [tableCheckbox, setTableCheckbox] = useState(false);
  const [formattedData, setFormattedData] = useState<ImportedOrderType[]>([]);

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

  return (
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
          leftIcon={<TbEdit size={16} />}
          variant="outline"
          color="blue"
          onClick={() => {}}
        >
          Edit
        </Button>
      </InfoWrapper>
    </StockWrapper>
  );
};

export default OrderDetailTable;
