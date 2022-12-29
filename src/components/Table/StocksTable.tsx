import { useRouter } from "next/router";
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
});

const StocksTable = () => {
  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              {/* <TableHeadItem css={{ width: "7%" }}>Date</TableHeadItem> */}
              <TableHeadItem css={{ width: "5%" }}>Sl. No.</TableHeadItem>
              <TableHeadItem css={{ width: "15%" }}>{"Holder"}</TableHeadItem>
              <TableHeadItem>{"Token Id"}</TableHeadItem>
              <TableHeadItem css={{ width: "15%" }}>
                {"Value ( ETH )"}
              </TableHeadItem>
              <TableHeadItem css={{ width: "15%" }}>
                {"Value ( $ )"}
              </TableHeadItem>
              <TableHeadItem css={{ width: "15%" }}>
                {"Purchase Date"}
              </TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {new Array(20).fill(1).map((_, index) => {
              return (
                <TableRow key={index}>
                  <TableItem css={{ width: "5%" }}>{index + 1}</TableItem>
                  <TableItem css={{ width: "15%" }}>{"Holder"}</TableItem>
                  <TableItem>{"Token Id"}</TableItem>
                  <TableItem css={{ width: "15%" }}>
                    {"Value ( ETH )"}
                  </TableItem>
                  <TableItem css={{ width: "15%" }}>{"Value ( $ )"}</TableItem>
                  <TableItem css={{ width: "15%" }}>
                    {"Purchase Date"}
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

export default StocksTable;
