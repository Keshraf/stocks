import { Loader, Tabs } from "@mantine/core";
import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import OrderDetailTable from "~/components/Table/OrderDetailTable";

export type OrderDetails = {
  specId: string;
  qualityName: string;
  millName: string;
  breadth: number;
  length: number;
  weight: number;
  gsm: number;
  sheets: number;
  pending: number;
  billed: number;
  shipped: number;
};

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
  variants: {
    direction: {
      center: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "1px",
  backgroundColor: "$highlight",
});

const InfoWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "$gapLarge",
  flexWrap: "wrap",
  marginBottom: "$gapLarge",
});

const InfoWrapper2 = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
  overflowX: "auto",
  overflowY: "hidden",
});

const InfoRow = styled("div", {
  width: "fit-content",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const OrderIdPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!router.isReady) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  if (!id) return null;
  if (typeof id !== "string") {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  if (typeof id !== "string") {
    return <Text>Invalid ID</Text>;
  }

  const { data, isLoading } = trpc.orders.getOrderById.useQuery(id);

  if (!data || isLoading || !data.order) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  /* console.log("Data: ", data); */

  const orderDetails = {
    billingAddress: data.order?.billingAddress,
    shippingAddress: data.order?.shippingAddress,
    clientName: data.order?.clientName,
    shippingClientName: data.order?.shippingClientName,
    orderDate: data.order?.orderDate,
    orderId: data.order?.orderId,
  };

  const allSpecs = new Set<string>();

  const formattedOrderDetails = data.order.stockOrder.map((stockOrder) => {
    allSpecs.add(stockOrder.stock.specs.id);

    return {
      specId: stockOrder.stock.specs.id,
      qualityName: stockOrder.stock.specs.qualityName,
      millName: stockOrder.stock.specs.quality.millName,
      breadth: stockOrder.stock.specs.breadth,
      length: stockOrder.stock.specs.length,
      weight: stockOrder.stock.specs.weight,
      gsm: stockOrder.stock.specs.gsm,
      sheets: stockOrder.stock.specs.sheets,
      pending: stockOrder.pending,
      billed: stockOrder.billed,
      shipped: stockOrder.shipped,
    } as OrderDetails;
  });

  const orderStats: OrderDetails[] = [];

  allSpecs.forEach((spec) => {
    const filteredArr: OrderDetails[] = formattedOrderDetails.filter(
      (order) => order.specId === spec
    );
    const stats = filteredArr.reduce(
      (acc, curr) => {
        return {
          pending: acc.pending + curr.pending,
          billed: acc.billed + curr.billed,
          shipped: acc.shipped + curr.shipped,
        };
      },
      {
        pending: 0,
        billed: 0,
        shipped: 0,
      }
    );

    const firstArr = filteredArr[0];

    if (firstArr) {
      orderStats.push({
        ...firstArr,
        ...stats,
      });
    }
  });

  const Header = [
    {
      label: "Order Id",
      value: orderDetails.orderId,
      width: "100px",
    },
    {
      label: "Order Date",
      value: orderDetails.orderDate
        ? new Date(orderDetails.orderDate).toLocaleDateString()
        : "-",
      width: "100px",
    },
    {
      label: "Client Name",
      value: orderDetails.clientName,
      width: "100px",
    },
    {
      label: "Shipping Client Name",
      value: orderDetails.shippingClientName,
      width: "200px",
    },
    {
      label: "Billing Address",
      value: orderDetails.billingAddress,
      width: "300px",
    },
    {
      label: "Shipping Address",
      value: orderDetails.shippingAddress,
      width: "300px",
    },
  ];

  console.log("Order Stats: ", orderStats);

  const HeadersTwo = [
    {
      title: "Mill Name",
      width: "100px",
    },
    {
      title: "Quality",
      width: "70px",
    },
    {
      title: "Size",
      width: "70px",
    },
    {
      title: "Weight",
      width: "70px",
    },
    {
      title: "GSM",
      width: "70px",
    },
    {
      title: "Sheets",
      width: "70px",
    },
    {
      title: "Pending",
      width: "100px",
    },
    {
      title: "Billed",
      width: "100px",
    },
    {
      title: "Shipped",
      width: "100px",
    },
  ];

  return (
    <>
      <Wrapper>
        <Text>Order Details</Text>
        <InfoWrapper>
          {Header.map((data, index) => {
            return (
              <InfoRow key={index + data.label}>
                <Text width={data.width} type="MediumSemibold">
                  {data.label}
                </Text>
                <Text type="MediumRegular">{data.value}</Text>
              </InfoRow>
            );
          })}
        </InfoWrapper>

        <DividerWrapper />
        <InfoWrapper2>
          {HeadersTwo.map((header, index) => {
            return (
              <InfoRow css={{ width: header.width }} key={index}>
                <Text type="SmallBold">{header.title}</Text>
              </InfoRow>
            );
          })}
        </InfoWrapper2>
        {orderStats.map((item) => (
          <OrderDetailTable data={item} key={item.specId} />
        ))}
      </Wrapper>
    </>
  );
};

export default OrderIdPage;
