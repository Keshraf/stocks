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
import { PrismaStock } from "../../types/stocks";
import { type PrismaSpecs } from "../../types/stocks";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/store";
import { Checkbox } from "@mantine/core";
import { addSelectedSpecs, removeSpecs } from "~/store/selectedSpecs";

const Wrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  boxSizing: "border-box",
});

interface SpecsTableData {
  id: string;
  breadth: number;
  length: number | null;
  weight: number;
  gsm: number;
  sheets: number;
  qualityName: string;
  millName: string | null | undefined;
  millCode: string;
  quantity: string | number;
  transit: number;
  ordered: number;
  total: number;
}

interface MillObjects {
  [key: string]: string[];
}

const SpecsTable = ({ data }: { data: PrismaSpecs[] }) => {
  const [formattedData, setFormattedData] = useState<SpecsTableData[]>([]);
  const [originalData, setOriginalData] = useState<SpecsTableData[]>([]);
  /* const [mill, setMill] = useState(false); */
  const [tableCheckbox, setTableCheckbox] = useState(false);
  const [quantity, setQuantity] = useState(true);
  const search = useAppSelector((state) => state.search);
  const { stocks: filter } = useAppSelector((state) => state.filter);

  const selectedSpecs = useAppSelector((state) => state.selectedSpecs);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Get the total quantity of a stock
  const getTotalStockQuantity = useCallback((stocks: PrismaStock[]) => {
    let total = 0;
    stocks.forEach((stock) => {
      total += stock.quantity;
    });
    return total;
  }, []);

  const getTotalStockTransit = useCallback((stocks: PrismaStock[]) => {
    let total = 0;
    stocks.forEach((stock) => {
      total += stock.transit;
    });
    return total;
  }, []);

  const getTotalStockOrdered = useCallback((stocks: PrismaStock[]) => {
    let total = 0;
    stocks.forEach((stock) => {
      total += stock.ordered;
    });
    return total;
  }, []);

  // Wrangle the data to be displayed in the table
  const wrangleData = useCallback(() => {
    let qualities: string[] = [];
    let mills: MillObjects = {};
    const wrangledData: SpecsTableData[] = data.map((item) => {
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
        id: item.id,
        breadth: item.breadth,
        length: item.length,
        weight: item.weight,
        gsm: item.gsm,
        sheets: item.sheets,
        qualityName: item.quality.name,
        millCode: item.quality.millName,
        millName: item.quality.millName,
        quantity:
          item.stock && item.stock.length > 0
            ? quantity
              ? `${Math.round(getTotalStockQuantity(item.stock))} PKT`
              : `${getTotalStockQuantity(item.stock) * item.weight} KG`
            : 0,
        transit:
          item.stock && item.stock.length > 0
            ? getTotalStockTransit(item.stock)
            : 0,
        ordered:
          item.stock && item.stock.length > 0
            ? getTotalStockOrdered(item.stock)
            : 0,
        total:
          item.stock && item.stock.length > 0
            ? getTotalStockQuantity(item.stock) +
              getTotalStockOrdered(item.stock) +
              getTotalStockTransit(item.stock)
            : 0,
      };
    });

    return { wrangledData, mills, qualities };
  }, [
    data,
    quantity,
    getTotalStockQuantity,
    getTotalStockTransit,
    getTotalStockOrdered,
  ]);

  const generalFilterData = useCallback(
    (mills: MillObjects, wrangledData: SpecsTableData[]) =>
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
  }, [data, quantity, wrangleData, generalFilterData]);

  useEffect(() => {
    let newFormattedData = originalData.filter((item) => {
      const stockSentence = `${item.millName} ${item.qualityName} ${item.breadth} X ${item.length} ${item.breadth}X${item.length} ${item.weight}KG ${item.gsm}G ${item.sheets} S`;
      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });

    if (filter) {
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

  const checkHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    item: SpecsTableData,
    id: string
  ) => {
    e.stopPropagation();
    if (checked) {
      dispatch(
        addSelectedSpecs({
          id,
          millName: item.millCode,
          qualityName: item.qualityName,
          breadth: item.breadth,
          length: item.length ? item.length : 0,
          weight: item.weight,
          gsm: item.gsm,
          sheets: item.sheets,
        })
      );
    } else {
      dispatch(removeSpecs(id));
    }
  };

  const rowClickHandler = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    id: string
  ) => {
    if (e.target instanceof HTMLInputElement) return;

    router.push(`/stocks/${id}`);
  };

  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              <TableHeadItem css={{ width: "25px" }}>
                <Checkbox
                  checked={tableCheckbox}
                  onChange={(e) => setTableCheckbox(e.currentTarget.checked)}
                  size="xs"
                />
              </TableHeadItem>
              <TableHeadItem css={{ width: "50px" }}>Sl. No.</TableHeadItem>
              <TableHeadItem>{"Mill"}</TableHeadItem>
              <TableHeadItem>{"Quality"}</TableHeadItem>
              <TableHeadItem>{"Size"}</TableHeadItem>
              <TableHeadItem>{"Weight"}</TableHeadItem>
              <TableHeadItem>{"GSM"}</TableHeadItem>
              <TableHeadItem>{"Sheets"}</TableHeadItem>
              <TableHeadItem onClick={() => setQuantity((prev) => !prev)}>
                {"Godown"}
              </TableHeadItem>
              <TableHeadItem>{"Transit"}</TableHeadItem>
              <TableHeadItem>{"Ordered"}</TableHeadItem>
              <TableHeadItem>{"Total"}</TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedData.map((item, index) => {
              let checked = false;
              if (
                selectedSpecs.findIndex((stock) => stock.id === item.id) !== -1
              ) {
                checked = true;
              }

              if (tableCheckbox && !checked) {
                return <></>;
              }

              return (
                <TableRow
                  key={index}
                  onClick={(e) => rowClickHandler(e, item.id)}
                >
                  <TableItem css={{ width: "25px" }}>
                    <Checkbox
                      checked={checked}
                      onChange={(event) =>
                        checkHandler(
                          event,
                          event.currentTarget.checked,
                          item,
                          item.id
                        )
                      }
                      size="xs"
                    />
                  </TableItem>
                  <TableItem css={{ width: "50px" }}>{index + 1}</TableItem>
                  <TableItem>{item.millName}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.qualityName}
                  </TableItem>
                  <TableItem>{item.breadth + " X " + item.length}</TableItem>
                  <TableItem>{item.weight} KG</TableItem>
                  <TableItem>{item.gsm} G</TableItem>
                  <TableItem>{item.sheets} S</TableItem>
                  <TableItem status={"success"}>{item.quantity}</TableItem>
                  <TableItem status={item.transit > 0 ? "alert" : "normal"}>
                    {item.transit} PKT
                  </TableItem>
                  <TableItem status={item.ordered > 0 ? "alert2" : "normal"}>
                    {item.ordered} PKT
                  </TableItem>
                  <TableItem status={item.total < 100 ? "danger" : "normal"}>
                    {item.total} PKT
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

export default SpecsTable;
