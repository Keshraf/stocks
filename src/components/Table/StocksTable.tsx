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
import { PrismaStock, type Stock } from "../../types/stocks";
import { type PrismaSpecs } from "../../types/stocks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "~/store";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

interface StocksTableData {
  breadth: number;
  length: number | null;
  weight: number;
  gsm: number;
  sheets: number;
  qualityName: string;
  millName: string | null | undefined;
  millCode: string;
  quantity: string | number;
}

interface MillObjects {
  [key: string]: string[];
}

const StocksTable = ({ data }: { data: PrismaSpecs[] }) => {
  const [formattedData, setFormattedData] = useState<StocksTableData[]>([]);
  const [originalData, setOriginalData] = useState<StocksTableData[]>([]);
  const [mill, setMill] = useState(false);
  const [quantity, setQuantity] = useState(true);
  const search = useAppSelector((state) => state.search);
  const { stocks: filter } = useAppSelector((state) => state.filter);

  // Capitalise the first letter of each word in a string
  const capitalise = useCallback((string: string | null | undefined) => {
    if (!string) return string;

    return string
      .split(" ")
      .map((str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
      .join(" ");
  }, []);

  // Get the total quantity of a stock
  const getTotalStockQuantity = useCallback((stocks: PrismaStock[]) => {
    let total = 0;
    stocks.forEach((stock) => {
      total += stock.quantity;
    });
    return total;
  }, []);

  // Wrangle the data to be displayed in the table
  const wrangleData = useCallback(() => {
    let qualities: string[] = [];
    let mills: MillObjects = {};
    const wrangledData: StocksTableData[] = data.map((item) => {
      if (!Object.keys(mills).includes(item.quality.millName)) {
        mills[item.quality.millName] = [];
      }

      if (mills[item.quality.millName]) {
        let millQualities = mills[item.quality.millName];

        if (millQualities && !millQualities.includes(item.quality.name)) {
          millQualities.push(item.quality.name);
          mills[item.quality.millName] = millQualities;
          qualities.push(item.quality.name);
        }
      }

      return {
        breadth: item.breadth,
        length: item.length,
        weight: item.weight,
        gsm: item.gsm,
        sheets: item.sheets,
        qualityName: item.quality.name,
        millCode: item.quality.millName,
        millName: item.quality.mill
          ? mill
            ? capitalise(item.quality.mill.fullname)
            : item.quality.millName
          : item.quality.millName,
        quantity:
          item.stock && item.stock.length > 0
            ? quantity
              ? `${Math.round(
                  getTotalStockQuantity(item.stock) / item.weight
                )} PKT`
              : `${getTotalStockQuantity(item.stock)} KG`
            : 0,
      };
    });

    return { wrangledData, mills, qualities };
  }, [data, mill, quantity, capitalise, getTotalStockQuantity]);

  const generalFilterData = useCallback(
    (mills: MillObjects, wrangledData: StocksTableData[]) =>
      Object.keys(mills).map((millCode) => {
        // Filters by Mill Code
        const millFilterData = wrangledData.filter(
          (item) => item.millCode === millCode
        );

        // Filters by Quality of the MillCode
        const qualities = mills[millCode];
        if (!qualities) return;
        const qualitiesFilteredData = qualities.map((quality) => {
          // Filters by a Particular Quality
          const qualityFilterData = millFilterData.filter(
            (item) => item.qualityName === quality
          );

          // Sorts by GSM of the Quality
          const SortByGSM = qualityFilterData.sort((a, b) => {
            return a.gsm - b.gsm;
          });

          // Sorts by Breadth of the Quality
          const SortByBreadth = SortByGSM.sort((a, b) => {
            return a.breadth - b.breadth;
          });

          return SortByBreadth;
        });

        return qualitiesFilteredData.flat(1);
      }),
    []
  );

  useEffect(() => {
    const { wrangledData, mills, qualities } = wrangleData();

    const generalFilteredData = generalFilterData(mills, wrangledData);

    const filteredData = generalFilteredData
      .flat(1)
      .filter((item) => item !== undefined);

    /* @ts-ignore */
    setFormattedData(filteredData);
    /* @ts-ignore */
    setOriginalData(filteredData);
  }, [data, mill, quantity, wrangleData, generalFilterData]);

  useEffect(() => {
    /* if (!search) return;
    if (search === "") {
      setFormattedData(originalData);
      return;
    } */
    let newFormattedData = originalData.filter((item) => {
      const stockSentence = `${item.millName} ${item.qualityName} ${item.breadth} X ${item.length} ${item.weight}KG ${item.gsm}G ${item.sheets} S`;
      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });
    /* console.log("NEW FORMATTED DATA", newFormattedData); */

    if (filter) {
      /* console.log("FILTER", filter); */
      filter.forEach((item) => {
        if (!item.active) return;
        newFormattedData = newFormattedData.filter((stock) => {
          if (item.greater) {
            if (stock[item.key] >= item.defaultValue) return stock;
          } else {
            if (stock[item.key] <= item.defaultValue) return stock;
          }
        });
      });
    }

    setFormattedData(newFormattedData);
  }, [search, originalData, filter]);

  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              <TableHeadItem css={{ width: "4%" }}>Sl. No.</TableHeadItem>
              <TableHeadItem onClick={() => setMill((prev) => !prev)}>
                {mill ? "Mill Name" : "Mill Code"}
              </TableHeadItem>
              <TableHeadItem>{"Quality"}</TableHeadItem>
              <TableHeadItem>{"Size"}</TableHeadItem>
              <TableHeadItem>{"Weight"}</TableHeadItem>
              <TableHeadItem>{"GSM"}</TableHeadItem>
              <TableHeadItem>{"Sheets"}</TableHeadItem>
              <TableHeadItem onClick={() => setQuantity((prev) => !prev)}>
                {"Quantity"}
              </TableHeadItem>
              <TableHeadItem>{"Actions"}</TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedData.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableItem css={{ width: "4%" }}>{index + 1}</TableItem>
                  <TableItem>{item.millName}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.qualityName}
                  </TableItem>
                  <TableItem>{item.breadth + " X " + item.length}</TableItem>
                  <TableItem>{item.weight} KG</TableItem>
                  <TableItem>{item.gsm} G</TableItem>
                  <TableItem>{item.sheets} S</TableItem>
                  <TableItem>{item.quantity}</TableItem>
                  <TableItem>{"Actions"}</TableItem>
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
