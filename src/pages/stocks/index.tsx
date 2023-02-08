import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import ActionHeader from "../../components/ActionHeader/ActionHeader";
import { styled } from "../../../stitches.config";
import StocksTable from "../../components/Table/StocksTable";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";

const Main = styled("main", {
  width: "100%",
  height: "auto",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
});

const Page: NextPageWithLayout = () => {
  const user = trpc.getMe.useQuery();
  const stocks = trpc.stocks.getStocks.useQuery();
  const router = useRouter();

  switch (user.status) {
    case "loading": {
      return <h2>Loading...</h2>;
    }
    case "error": {
      router.push("/");
    }
    case "success": {
      if (stocks.status === "success") {
        return (
          <>
            <Main>
              <StocksTable data={stocks.data} />
            </Main>
          </>
        );
      } else {
        return <h2>Loading...</h2>;
      }
    }
    default: {
      return <h2>Loading...</h2>;
    }
  }
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      {" "}
      <ActionHeader />
      {page}
    </>
  );
};

export default Page;
