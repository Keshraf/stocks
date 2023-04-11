import Text from "../UI/Text";
import { changeNumberSpecs, InitalState } from "~/store/selectedSpecs";
import { useMemo, useState } from "react";
import { styled } from "stitches.config";
import { NumberInput } from "@mantine/core";
import { useAppDispatch } from "~/store";
import BundleTable from "../Table/BundleTable";
const InfoWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
  overflowX: "auto",
  overflowY: "hidden",
});

const InfoRow = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

const NumberInputWrapper = styled("div", {
  width: "80px",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const NumberSpan = styled("span", {
  fontFamily: "Poppins",
  fontSize: "14px",
  fontWeight: "400",
  color: "$content",
  margin: "0px",
  marginLeft: "$gapSmall",
});

type StockItemChangeProps = {
  stock: InitalState;
};

type StockConfig = {
  title: string;
  value: string | number | null;
  width: string;
};

type InputConfig = {
  title: string;
  key: "quantity" | "rate";
  value: number;
  width: string;
  max: number;
};

type Client = {
  clientName: string;
  quantity: number;
};

export type BundleConfig = {
  title: string;
  quantity: number;
  transit: number;
  ordered: number;
  clientQuantity: number;
  client: Client[];
  total: number;
  bundle: number;
};

const StockItemChange = ({ stock }: StockItemChangeProps) => {
  const dispatch = useAppDispatch();

  const StockData: StockConfig[] = [
    {
      title: "Mill",
      value: stock.millName,
      width: "30px",
    },
    {
      title: "Quality",
      value: stock.qualityName,
      width: "70px",
    },
    {
      title: "Size",
      value: `${stock.breadth}X${stock.length}`,
      width: "70px",
    },
    {
      title: "Weight",
      value: `${stock.weight}KG`,
      width: "50px",
    },
    {
      title: "GSM",
      value: `${stock.gsm}G`,
      width: "50px",
    },
    {
      title: "Sheets",
      value: `${stock.sheets}S`,
      width: "50px",
    },
    {
      title: "Godown",
      value: `${stock.totalQuantity}`,
      width: "75px",
    },
    {
      title: "Transit",
      value: `${stock.totalTransit}`,
      width: "75px",
    },
    {
      title: "Ordered",
      value: `${stock.totalOrdered}`,
      width: "75px",
    },
    {
      title: "Total",
      value: `${stock.totalQuantity + stock.totalTransit + stock.totalOrdered}`,
      width: "75px",
    },
  ];

  const InputStockData: InputConfig[] = [
    {
      title: "Quantity",
      key: "quantity",
      value: stock.quantity,
      width: "100px",
      max: stock.totalQuantity + stock.totalTransit + stock.totalOrdered,
    },
    {
      title: "Rate",
      key: "rate",
      value: stock.rate,
      width: "100px",
      max: 100000,
    },
  ];

  /* const bundles = useMemo(() => {
    const bundleNames = new Set<number>();
    const bundleData = stock.stock?.map((item) => {
      bundleNames.add(item.bundle);
      let clientTotal = 0;
      let client = {
        clientName: "",
        quantity: 0,
      };
      if (item.invoice?.clientName) {
        clientTotal += item.quantity + item.transit + item.ordered;
        client = {
          clientName: item.invoice?.clientName,
          quantity: clientTotal,
        };
      }

      return {
        title: `1X${item.bundle}`,
        quantity: item.quantity,
        transit: item.transit,
        ordered: item.ordered,
        clientQuantity: clientTotal,
        client: [client],
        total: item.quantity + item.transit + item.ordered,
        bundle: item.bundle,
      };
    });

    if (!bundleData) return [];

    const finalBundleData: BundleConfig[] = Array.from(bundleNames)
      .map((bundle) => {
        return bundleData
          .filter((item) => item.bundle === bundle)
          .reduce((acc, item) => {
            let client = [];
            if (item.client.length === 0 || acc.client[0]?.clientName === "") {
              client = [...acc.client];
            } else {
              client = [...acc.client, ...item.client];
            }

            return {
              title: `1X${item.bundle}`,
              quantity: acc.quantity + item.quantity,
              transit: acc.transit + item.transit,
              ordered: acc.ordered + item.ordered,
              clientQuantity: acc.clientQuantity + item.clientQuantity,
              client,
              total: acc.total + item.total,
              bundle: item.bundle,
            };
          });
      })
      .sort((a, b) => a.bundle - b.bundle)
      .filter((item) => item.total > 0)
      .map((item) => {
        // THIS WILL FILTER EMPTY CLIENTS AND MERGE THE REST

        // Create new array to store client
        const foundClient: Client[] = [];
        // Remove empty client
        const allClients: Client[] = item.client.filter(
          (item) => item.clientName !== ""
        );

        allClients.forEach((client) => {
          const found = foundClient.find(
            (item) => item.clientName === client.clientName
          );
          if (found) {
            found.quantity += client.quantity;
          } else {
            foundClient.push(client);
          }
        });

        return {
          ...item,
          client: foundClient,
        };
      });

    return finalBundleData;
  }, [stock]); */

  /* console.log("BUNDLES", bundles); */

  return (
    <>
      <InfoWrapper>
        {StockData.map((data, index) => {
          return (
            <InfoRow
              css={{ width: data.width }}
              key={stock.id + "inforow" + index}
            >
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}
        {InputStockData.map((data, index) => {
          return (
            <InfoRow
              css={{ width: data.width }}
              key={stock.id + "inforow" + index}
            >
              <NumberInput
                placeholder={`Enter ${data.title}`}
                defaultValue={0}
                precision={0}
                min={0}
                max={data.max}
                value={data.value}
                onChange={(value) => {
                  if (value === undefined || value === null) return;
                  dispatch(
                    changeNumberSpecs({
                      type: data.key,
                      value,
                      id: stock.id,
                    })
                  );
                }}
              />
            </InfoRow>
          );
        })}
      </InfoWrapper>
      {/* <DividerWrapper /> */}
    </>
  );
};

export default StockItemChange;
