import { styled } from "stitches.config";
import {
  TableItem,
  TableRow,
  TableHead,
  TableBody,
  TableWrapper,
  TableHeadItem,
} from "./elements";

import { type BundleConfig } from "../ChangeGroup/StockItemChange";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  overflow: "scroll",
});

type TableProps = {
  data: BundleConfig[];
};

interface Headers {
  name: string;
  key:
    | "title"
    | "quantity"
    | "transit"
    | "ordered"
    | "clientQuantity"
    | "total"
    | "bundle";
  width: string;
}

const BundleTable = ({ data }: TableProps) => {
  const headers: Headers[] = [
    {
      name: "Bundle",
      key: "title",
      width: "100px",
    },
    {
      name: "Godown",
      key: "quantity",
      width: "100px",
    },
    {
      name: "Transit",
      key: "transit",
      width: "100px",
    },
    {
      name: "Ordered",
      key: "ordered",
      width: "100px",
    },
    {
      name: "Client",
      key: "clientQuantity",
      width: "100px",
    },
    {
      name: "Total",
      key: "total",
      width: "100px",
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
              <TableRow key={client.title} style={{ cursor: "pointer" }}>
                {headers.map((header) => {
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

export default BundleTable;
