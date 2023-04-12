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
import { Checkbox } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store";
import { useRouter } from "next/router";
import { addOrderSelected, removeOrderById } from "~/store/selectedOrder";
import OrderTableActions from "./components/OrderTableActions";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  overflow: "scroll",
});

interface Headers {
  name: string;
  key:
    | "createdAt"
    | "orderDate"
    | "clientName"
    | "billingAddress"
    | "shippingClientName"
    | "orderId"
    | "shippingAddress"
    | "check";
  width: string;
}

const OrderTable = ({ data }: { data: ImportedOrderType[] }) => {
  const selectedOrders = useAppSelector((state) => state.selectedOrder);
  const dispatch = useAppDispatch();

  const [tableCheckbox, setTableCheckbox] = useState(false);
  const search = useAppSelector((state) => state.search);
  const [formattedData, setFormattedData] = useState<ImportedOrderType[]>([]);
  const router = useRouter();
  const headers: Headers[] = [
    {
      name: "Check",
      key: "check",
      width: "25px",
    },
    {
      name: "Date",
      key: "orderDate",
      width: "100px",
    },
    {
      name: "Order ID",
      key: "orderId",
      width: "200px",
    },
    {
      name: "Billing Client",
      key: "clientName",
      width: "250px",
    },
    {
      name: "Shipping Client",
      key: "shippingClientName",
      width: "250px",
    },
    {
      name: "Billing Address",
      key: "billingAddress",
      width: "300px",
    },
    {
      name: "Shipping Address",
      key: "shippingAddress",
      width: "300px",
    },
  ];

  useEffect(() => {
    const filteredData = data.filter((item) => {
      const stockSentence = `${item.orderId} ${item.shippingClientName} ${
        item.clientName
      } ${item.billingAddress} ${item.shippingAddress} ${
        item.orderDate ? new Date(item.orderDate).toLocaleDateString() : ""
      }}`;

      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });
    setFormattedData(filteredData);
  }, [data, search]);

  const rowClickHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string
  ) => {
    if (e.target instanceof HTMLInputElement) return;

    router.push(`/orders/${id}`);
  };

  function checkHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    id: string
  ) {
    e.stopPropagation();
    if (checked) {
      dispatch(addOrderSelected(id));
    } else {
      dispatch(removeOrderById(id));
    }
  }

  return (
    <Wrapper>
      <TableWrapper>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => {
              if (header.key === "check") {
                return (
                  <TableHeadItem css={{ width: header.width }} key={header.key}>
                    <Checkbox
                      checked={tableCheckbox}
                      onChange={(e) =>
                        setTableCheckbox(e.currentTarget.checked)
                      }
                      size="xs"
                    />
                  </TableHeadItem>
                );
              }

              return (
                <TableHeadItem
                  key={header.key}
                  style={{
                    width: header.width,
                    position: index === 0 ? "sticky" : "static",
                  }}
                >
                  {header.name}
                </TableHeadItem>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {formattedData.map((client) => {
            return (
              <TableRow
                key={client.id}
                style={{ cursor: "pointer" }}
                onClick={(e) => rowClickHandler(e, client.id)}
              >
                {headers.map((header) => {
                  if (header.key === "check") {
                    return (
                      <TableItem
                        key={header.key}
                        style={{ width: header.width }}
                      >
                        <Checkbox
                          checked={selectedOrders.includes(client.id)}
                          onChange={(e) =>
                            checkHandler(e, e.currentTarget.checked, client.id)
                          }
                          size="xs"
                        />
                      </TableItem>
                    );
                  }

                  if (header.key === "orderDate") {
                    return (
                      <TableItem
                        key={header.key}
                        style={{ width: header.width }}
                      >
                        {/* @ts-ignore */}
                        {new Date(client[header.key]).toLocaleDateString()}
                      </TableItem>
                    );
                  }

                  return (
                    <TableItem key={header.key} style={{ width: header.width }}>
                      {/* @ts-ignore */}
                      {client[header.key]}
                    </TableItem>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </TableWrapper>
    </Wrapper>
  );
};

export default OrderTable;
