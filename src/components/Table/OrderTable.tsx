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
    | "orderId"
    | "clientName"
    | "billingAddress"
    | "shippingAddress";
  width: string;
}

const OrderTable = ({ data }: { data: ImportedOrderType[] }) => {
  const headers: Headers[] = [
    {
      name: "Date",
      key: "createdAt",
      width: "100px",
    },
    {
      name: "Order ID",
      key: "orderId",
      width: "200px",
    },
    {
      name: "Client Name",
      key: "clientName",
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

  return (
    <Wrapper>
      <TableWrapper>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => {
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
          {data.map((client) => {
            return (
              <TableRow key={client.id} style={{ cursor: "pointer" }}>
                {headers.map((header) => {
                  if (header.key === "createdAt") {
                    return (
                      <TableItem
                        key={header.key}
                        style={{ width: header.width }}
                      >
                        {new Date(client[header.key]).toLocaleDateString()}
                      </TableItem>
                    );
                  }

                  return (
                    <TableItem key={header.key} style={{ width: header.width }}>
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
