import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import ActionHeader from "../components/ActionHeader/ActionHeader";
import { styled } from "../../stitches.config";
import StocksTable from "../components/Table/StocksTable";

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
  return (
    <>
      <Head>
        <title>Balaji Khata</title>
      </Head>
      <Main>
        <StocksTable />
      </Main>
    </>
  );
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
