import { Loader } from "@mantine/core";
import { ReactElement } from "react";
import { styled } from "stitches.config";
import ActionHeader from "~/components/ActionHeader/ActionHeaderClient";
import ClientsTable from "~/components/Table/ClientsTable";
import Text from "~/components/UI/Text";
import UserCheck from "~/components/UserCheck";
import { trpc } from "~/utils/trpc";
import { NextPageWithLayout } from "../_app";

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
});

const Client: NextPageWithLayout = () => {
  const clients = trpc.clients.getClients.useQuery();

  if (!clients.data)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    );

  return (
    <>
      <Wrapper>
        <ClientsTable data={clients.data} />
      </Wrapper>
    </>
  );
};

Client.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserCheck>
      {" "}
      <ActionHeader />
      {page}
    </UserCheck>
  );
};

export default Client;
