import { Checkbox } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { type StocksTableData } from "~/pages/mills";
import { useAppDispatch, useAppSelector } from "~/store";
import {
  addSelectedStocks,
  removeStocks,
  resetSelectedStocks,
} from "~/store/selectedStocks";
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

const StocksTable = ({ data }: { data: StocksTableData[] }) => {
  const [tableCheckbox, setTableCheckbox] = useState(false);
  const [formattedData, setFormattedData] = useState<StocksTableData[]>([]);

  const search = useAppSelector((state) => state.search);
  const selectedStocks = useAppSelector((state) => state.selectedStocks);
  const dispatch = useAppDispatch();

  const mills = useMemo(() => {
    const mills = new Set<string>();
    data.forEach((stock) => {
      mills.add(stock.millName);
    });
    const millObjects = Array.from(mills).map((mill) => {
      const qualities = new Set<string>();
      data.forEach((stock) => {
        if (stock.millName === mill) {
          qualities.add(stock.qualityName);
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
        const millStocks = data.filter((stock) => stock.millName === mill.mill);
        const sortedMillStocks = mill.qualities.map((quality) => {
          return millStocks.filter((stock) => stock.qualityName === quality);
        });
        return sortedMillStocks;
      })
      .flat(2);
    return sorted;
  }, [data, mills]);

  useEffect(() => {
    const filteredData = sortedData.filter((item) => {
      const stockSentence = `${item.millName} ${item.qualityName} ${item.breadth} X ${item.length} ${item.breadth}X${item.length} ${item.weight}KG ${item.gsm}G ${item.sheets} S ${item.invoice} ${item.salesOrder}`;

      return stockSentence.toLowerCase().includes(search.toLowerCase());
    });
    setFormattedData(filteredData);
  }, [sortedData, search]);

  function checkHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    item: StocksTableData,
    id: string
  ) {
    e.stopPropagation();
    if (checked) {
      dispatch(
        addSelectedStocks({
          id,
          millName: item.millName,
          qualityName: item.qualityName,
          breadth: item.breadth,
          length: item.length ? item.length : 0,
          weight: item.weight,
          gsm: item.gsm,
          sheets: item.sheets,
          transit: item.transit,
          ordered: item.ordered,
          invoice: item.invoice === "-" ? "" : item.invoice,
          /* client: item.client === "-" ? "" : item.client, */
          quantity: item.quantity,
        })
      );
    } else {
      dispatch(removeStocks(id));
    }
  }

  return (
    <>
      <Wrapper>
        <TableWrapper>
          <TableHead>
            <TableRow>
              <TableHeadItem css={{ width: "25px" }}>
                <Checkbox
                  checked={tableCheckbox}
                  onChange={(e) => {
                    setTableCheckbox(e.currentTarget.checked);
                    if (!e.currentTarget.checked) {
                      dispatch(resetSelectedStocks());
                    } else {
                      formattedData.forEach((item) => {
                        if (selectedStocks.find((spec) => spec.id === item.id))
                          return;
                        checkHandler(e, e.currentTarget.checked, item, item.id);
                      });
                    }
                  }}
                  size="xs"
                />
              </TableHeadItem>
              <TableHeadItem css={{ width: "50px" }}>{"Mill"}</TableHeadItem>
              <TableHeadItem>{"Quality"}</TableHeadItem>
              <TableHeadItem>{"Size"}</TableHeadItem>
              <TableHeadItem>{"Weight"}</TableHeadItem>
              <TableHeadItem>{"GSM"}</TableHeadItem>
              <TableHeadItem>{"Sheets"}</TableHeadItem>
              <TableHeadItem css={{ width: "150px" }}>
                {"Order No."}
              </TableHeadItem>
              <TableHeadItem css={{ width: "150px" }}>
                {"Sales Order No."}
              </TableHeadItem>
              {/* <TableHeadItem css={{ width: "150px" }}>Client</TableHeadItem> */}
              <TableHeadItem>{"Transit"}</TableHeadItem>
              <TableHeadItem>{"Ordered"}</TableHeadItem>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedData.map((item, index) => {
              let checked = false;
              if (
                selectedStocks.findIndex((stock) => stock.id === item.id) !== -1
              ) {
                checked = true;
              }

              /* if (tableCheckbox && !checked) {
                return <></>;
              } */

              return (
                <TableRow key={index}>
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
                  {/* <TableItem css={{ width: "50px" }}>{index + 1}</TableItem> */}
                  <TableItem css={{ width: "50px" }}>{item.millName}</TableItem>
                  <TableItem css={{ fontWeight: "$semibold" }}>
                    {item.qualityName}
                  </TableItem>
                  <TableItem>{item.breadth + " X " + item.length}</TableItem>
                  <TableItem>{item.weight} KG</TableItem>
                  <TableItem>{item.gsm} G</TableItem>
                  <TableItem>{item.sheets} S</TableItem>
                  <TableItem css={{ width: "150px" }}>{item.invoice}</TableItem>
                  <TableItem css={{ width: "150px" }}>
                    {item.salesOrder}
                  </TableItem>
                  {/* <TableItem css={{ width: "150px" }}>{item.client}</TableItem> */}
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
