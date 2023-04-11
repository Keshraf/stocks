import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { PrismaStock } from "~/types/stocks";
import { styled } from "../../../stitches.config";
import {
  TableItem,
  TableRow,
  TableHead,
  TableBody,
  TableWrapper,
  TableHeadItem,
} from "./elements";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  boxSizing: "border-box",
});

interface Headers {
  name: string;
  key: "name" | "mobile" | "email" | "order" | "address";
  width: string;
}

type StockItemData = Omit<
  PrismaStock,
  "updatedAt" | "specsId" | "specs" | "invoice"
>;

const StockItemTable = ({ data }: { data: StockItemData[] }) => {
  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              <TableHeadItem css={{ width: "50px" }}>Sl. No.</TableHeadItem>
              <TableHeadItem css={{ width: "150px" }}>
                {"Order No."}
              </TableHeadItem>
              <TableHeadItem css={{ width: "200px" }}>
                {"Created At"}
              </TableHeadItem>
              {/* <TableHeadItem>{"Client"}</TableHeadItem> */}
              <TableHeadItem>{"Rate"}</TableHeadItem>
              <TableHeadItem>{"Quantity"}</TableHeadItem>
              <TableHeadItem>{"Transit"}</TableHeadItem>
              <TableHeadItem>{"Ordered"}</TableHeadItem>
              <TableHeadItem>{"Total"}</TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableItem css={{ width: "50px" }}>{index + 1}</TableItem>
                  <TableItem css={{ width: "150px" }}>
                    {item.invoiceName}
                  </TableItem>
                  <TableItem css={{ width: "200px" }}>
                    {item.createdAt.toDateString()}
                  </TableItem>
                  {/* <TableItem>
                    {item.clientName ? item.clientName : "-"}
                  </TableItem> */}
                  <TableItem>{item.rate ? item.rate : "-"}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.quantity}
                  </TableItem>
                  <TableItem>{item.transit}</TableItem>
                  <TableItem>{item.ordered}</TableItem>
                  <TableItem>
                    {item.quantity + item.transit + item.ordered}
                  </TableItem>
                </TableRow>
              );
            })}
          </TableBody>
        </TableWrapper>
      </Wrapper>
    </>
  );
};

export default StockItemTable;
