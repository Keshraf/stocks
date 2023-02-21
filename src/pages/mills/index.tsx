import { Loader } from "@mantine/core";
import { ReactElement, useState } from "react";
import { styled } from "stitches.config";
import ActionHeader from "~/components/ActionHeader/ActionHeaderMillOrder";
import StockTableActions from "~/components/Table/components/StocksTableActions";
import StocksTable from "~/components/Table/StocksTable";
import Text from "~/components/UI/Text";
import UserCheck from "~/components/UserCheck";
import { trpc } from "~/utils/trpc";

const Wrapper = styled("main", {
  width: "100%",
  height: "stretch",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapXLarge",
  position: "relative",
});

export type StocksTableData = {
  id: string;
  ordered: number;
  transit: number;
  quantity: number;
  bundle: number;
  breadth: number;
  length: number | null;
  gsm: number;
  sheets: number;
  weight: number;
  qualityName: string;
  millName: string;
  invoice: string;
  client: string;
};

const MillPage = () => {
  const [transit, setTransit] = useState(true);
  const [ordered, setOrdered] = useState(true);
  const stocks = trpc.stocks.getStocks.useQuery({
    transit,
    ordered,
  });

  if (!stocks.data)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  const wrangledData: StocksTableData[] = stocks.data.map((stock) => {
    return {
      id: stock.id,
      ordered: stock.ordered,
      transit: stock.transit,
      quantity: stock.quantity,
      bundle: stock.bundle,
      breadth: stock.specs.breadth,
      length: stock.specs.length,
      gsm: stock.specs.gsm,
      sheets: stock.specs.sheets,
      weight: stock.specs.weight,
      qualityName: stock.specs.qualityName,
      millName: stock.specs.quality.millName,
      invoice: stock.invoiceName || "-",
      client: stock.invoice.clientName || "-",
    };
  });

  console.log(wrangledData);

  return (
    <>
      <Wrapper>
        <StocksTable data={wrangledData} />
        <StockTableActions refetch={stocks.refetch} />
      </Wrapper>
    </>
  );
};

MillPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserCheck>
      {" "}
      <ActionHeader />
      {page}
    </UserCheck>
  );
};

export default MillPage;
