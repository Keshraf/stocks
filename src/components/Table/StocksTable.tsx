import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { type StocksTableData } from "~/pages/mills";
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

const StocksTable = ({ data }: { data: StocksTableData[] }) => {
  const mills = useMemo(() => {
    const mills = new Set<string>();
    data.forEach((stock) => {
      mills.add(stock.mill);
    });
    const millObjects = Array.from(mills).map((mill) => {
      const qualities = new Set<string>();
      data.forEach((stock) => {
        if (stock.mill === mill) {
          qualities.add(stock.name);
        }
      });

      return {
        mill,
        qualities: Array.from(qualities),
      };
    });
    return millObjects;
  }, [data]);

  const sortedData = useMemo(() => {
    const sorted = mills
      .map((mill) => {
        const millStocks = data.filter((stock) => stock.mill === mill.mill);
        const sortedMillStocks = mill.qualities.map((quality) => {
          return millStocks.filter((stock) => stock.name === quality);
        });
        return sortedMillStocks;
      })
      .flat(2);
    return sorted;
  }, [data, mills]);

  console.log(sortedData);

  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              {/* <TableHeadItem css={{ width: "25px" }}>
                <Checkbox
                  checked={tableCheckbox}
                  onChange={(e) => setTableCheckbox(e.currentTarget.checked)}
                  size="xs"
                />
              </TableHeadItem> */}
              <TableHeadItem css={{ width: "50px" }}>Sl. No.</TableHeadItem>
              <TableHeadItem>{"Mill Name"}</TableHeadItem>
              <TableHeadItem>{"Quality"}</TableHeadItem>
              <TableHeadItem>{"Size"}</TableHeadItem>
              <TableHeadItem>{"Weight"}</TableHeadItem>
              <TableHeadItem>{"GSM"}</TableHeadItem>
              <TableHeadItem>{"Sheets"}</TableHeadItem>
              <TableHeadItem>{"Transit"}</TableHeadItem>
              <TableHeadItem>{"Ordered"}</TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((item, index) => {
              /* let checked = false;
              if (
                selectedStocks.findIndex((stock) => stock.id === item.id) !== -1
              ) {
                checked = true;
              }

              if (tableCheckbox && !checked) {
                return <></>;
              } */

              return (
                <TableRow key={index}>
                  {/* <TableItem css={{ width: "25px" }}>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        checkHandler(event.currentTarget.checked, item, item.id)
                      }
                      size="xs"
                    />
                  </TableItem> */}
                  <TableItem css={{ width: "50px" }}>{index + 1}</TableItem>
                  <TableItem>{item.mill}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.name}
                  </TableItem>
                  <TableItem>{item.breadth + " X " + item.length}</TableItem>
                  <TableItem>{item.weight} KG</TableItem>
                  <TableItem>{item.gsm} G</TableItem>
                  <TableItem>{item.sheets} S</TableItem>
                  {/* <TableItem status={"success"}>{item.quantity}</TableItem> */}
                  <TableItem status={item.transit > 0 ? "alert" : "normal"}>
                    {item.transit} PKT
                  </TableItem>
                  <TableItem status={item.ordered > 0 ? "alert2" : "normal"}>
                    {item.ordered} PKT
                  </TableItem>
                  {/* <TableItem status={item.total < 100 ? "danger" : "normal"}>
                    {item.total} PKT
                  </TableItem> */}
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
