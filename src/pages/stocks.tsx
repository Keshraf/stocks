import { NextPageWithLayout } from "./_app";
import { ReactElement, useEffect } from "react";
import ActionHeader from "../components/ActionHeader/ActionHeader";
import { styled } from "../../stitches.config";
import StocksTable from "../components/Table/StocksTable";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { JwtPayload } from "jsonwebtoken";

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
  const router = useRouter();

  switch (user.status) {
    case "loading": {
      return <h2>Loading...</h2>;
    }
    case "error": {
      router.push("/");
    }
    case "success": {
      return (
        <>
          <Main>
            <StocksTable />
          </Main>
        </>
      );
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
