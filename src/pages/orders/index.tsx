import { Loader, Tabs } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";
import { styled } from "stitches.config";
import ActionHeader from "~/components/ActionHeader/ActionHeaderOrder";
import OrderTableActions from "~/components/Table/components/OrderTableActions";
import OrderTable from "~/components/Table/OrderTable";
import Text from "~/components/UI/Text";
import UserCheck from "~/components/UserCheck";
import { trpc } from "~/utils/trpc";

const Wrapper = styled("main", {
  width: "100%",
  height: "stretch",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapXLarge",
  position: "relative",
  variants: {
    direction: {
      center: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

const ActionWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  position: "absolute",
  bottom: "0px",
});

const OrderPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("pending");
  const [status, setStatus] = useState<"pending" | "billed" | "shipped">(
    "pending"
  );
  const { data, isLoading, refetch, isFetching } =
    trpc.orders.getOrders.useQuery({
      status,
    });

  useEffect(() => {
    if (activeTab === "pending") {
      setStatus("pending");
    } else if (activeTab === "billed") {
      setStatus("billed");
    } else if (activeTab === "shipped") {
      setStatus("shipped");
    }
  }, [activeTab]);

  useEffect(() => {
    refetch();
  }, [status, refetch]);

  if (!data || isLoading) {
    return (
      <Wrapper direction="center">
        <Tabs value={activeTab} onTabChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="pending">Pending Orders</Tabs.Tab>
            <Tabs.Tab value="billed">Billed Orders</Tabs.Tab>
            <Tabs.Tab value="shipped">Shipped Orders</Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Loader />
      </Wrapper>
    );
  }

  console.log(data);

  return (
    <Wrapper>
      <Tabs
        style={{
          width: "100%",
        }}
        value={activeTab}
        onTabChange={setActiveTab}
      >
        <Tabs.List>
          <Tabs.Tab value="pending">Pending Orders</Tabs.Tab>
          <Tabs.Tab value="billed">Billed Orders</Tabs.Tab>
          <Tabs.Tab value="shipped">Shipped Orders</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <OrderTable data={data.orders} />
      <ActionWrapper>
        <OrderTableActions
          activeTab={activeTab ? activeTab : "pending"}
          refetch={refetch}
        />
      </ActionWrapper>
    </Wrapper>
  );
};

OrderPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserCheck>
      {" "}
      <ActionHeader />
      {page}
    </UserCheck>
  );
};

export default OrderPage;
