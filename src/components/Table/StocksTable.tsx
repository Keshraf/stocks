import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type StocksTableData } from "~/pages/mills";
import { useAppSelector } from "~/store";
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
  const search = useAppSelector((state) => state.search);
  const [formattedData, setFormattedData] = useState<StocksTableData[]>([]);
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

  useEffect(() => {
    const filteredData = sortedData.filter((item) => {
      const stockSentence = `${item.mill} ${item.name} ${item.breadth} X ${item.length} ${item.breadth}X${item.length} ${item.weight}KG ${item.gsm}G ${item.sheets} S ${item.invoice}`;

      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });
    setFormattedData(filteredData);
  }, [sortedData, search]);

  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              <TableHeadItem css={{ width: "50px" }}>Sl. No.</TableHeadItem>
              <TableHeadItem css={{ width: "150px" }}>
                Invoice Code
              </TableHeadItem>
              <TableHeadItem css={{ width: "100px" }}>Client</TableHeadItem>
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
            {formattedData.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableItem css={{ width: "50px" }}>{index + 1}</TableItem>
                  <TableItem css={{ width: "150px" }}>{item.invoice}</TableItem>
                  <TableItem css={{ width: "100px" }}>{item.client}</TableItem>
                  <TableItem>{item.mill}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.name}
                  </TableItem>
                  <TableItem>{item.breadth + " X " + item.length}</TableItem>
                  <TableItem>{item.weight} KG</TableItem>
                  <TableItem>{item.gsm} G</TableItem>
                  <TableItem>{item.sheets} S</TableItem>
                  <TableItem status={item.transit > 0 ? "alert" : "normal"}>
                    {item.transit} PKT
                  </TableItem>
                  <TableItem status={item.ordered > 0 ? "alert2" : "normal"}>
                    {item.ordered} PKT
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
