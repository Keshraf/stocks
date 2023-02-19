import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import ActionHeader from "../../components/ActionHeader/ActionHeaderStocks";
import { styled } from "../../../stitches.config";
import StocksTable from "../../components/Table/StocksTable";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import { Loader } from "@mantine/core";
import UserCheck from "~/components/UserCheck";
import { useAppSelector } from "~/store";
import StockTableActions from "~/components/Table/components/StockTableActions";

const Main = styled("main", {
  width: "100%",
  height: "auto",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  position: "relative",
});

const Page: NextPageWithLayout = () => {
  const stocks = trpc.stocks.getStocks.useQuery();

  if (stocks.status === "success") {
    return (
      <>
        <Main>
          <StocksTable data={stocks.data} />
          <StockTableActions />
        </Main>
      </>
    );
  } else {
    return (
      <Main>
        <Loader />
      </Main>
    );
  }
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserCheck>
      {" "}
      <ActionHeader />
      {page}
    </UserCheck>
  );
};

export default Page;
