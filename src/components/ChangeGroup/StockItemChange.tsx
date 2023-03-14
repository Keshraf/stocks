import Text from "../UI/Text";
import { InitalState, updateSelectedBundle } from "~/store/selectedSpecs";
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
  alignItems: "flex-start",
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
  const StockData: StockConfig[] = [
    {
      title: "Mill",
      value: stock.millName,
    },
    {
      title: "Quality",
      value: stock.qualityName,
    },
    {
      title: "Breadth",
      value: stock.breadth,
    },
    {
      title: "Length",
      value: stock.length ? stock.length : "-",
    },
    {
      title: "Weight",
      value: stock.weight,
    },
    {
      title: "GSM",
      value: stock.gsm,
    },
    {
      title: "Sheets",
      value: stock.sheets,
    },
  ];

  const bundles = useMemo(() => {
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
        /* THIS WILL FILTER EMPTY CLIENTS AND MERGE THE REST */

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
  }, [stock]);

  console.log("BUNDLES", bundles);

  return (
    <>
      <InfoWrapper>
        {StockData.map((data, index) => {
          return (
            <InfoRow key={stock.id + "inforow" + index}>
              <Text width="100px" type="MediumRegular">
                {data.title}
              </Text>
              <Text type="MediumSemibold">{data.value}</Text>
            </InfoRow>
          );
        })}

        {/* {bundles.map((data, index) => {
          return (
            <BundleItemChange
              data={data}
              id={stock.id}
              key={stock.id + "inforow" + index}
            />
          );
        })} */}
      </InfoWrapper>
      <div style={{ width: "70%" }}>
        <BundleTable data={bundles} />
      </div>
      <DividerWrapper />
    </>
  );
};

const BundleItemChange = ({ data, id }: { data: BundleConfig; id: string }) => {
  const [value, setValue] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const handleChange = (value: number | undefined) => {
    if (value === undefined) return;
    console.log(value);
    if (value !== 0 && value % data.bundle !== 0) {
      setError(true);
    } else {
      setError(false);
    }

    dispatch(
      updateSelectedBundle({
        id,
        key: data.bundle,
        value,
      })
    );

    setValue(value);
  };

  return (
    <InfoRow>
      <Text width="100px" type="MediumBold">
        {data.title}
        <NumberSpan>{data.total} PKTS</NumberSpan>
      </Text>
      <NumberInputWrapper>
        <NumberInput
          error={error ? `Number must be divisible by ${data.bundle}` : false}
          onChange={(value) => handleChange(value)}
          value={value}
          step={data.bundle}
          max={data.total}
          min={0}
        />
      </NumberInputWrapper>
    </InfoRow>
  );
};

export default StockItemChange;
