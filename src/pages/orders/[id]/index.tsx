import { Button, Loader, Tabs } from "@mantine/core";
import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import OrderDetailTable from "~/components/Table/OrderDetailTable";
import { TbEdit, TbTrash } from "react-icons/tb";
import { toast } from "react-hot-toast";

export type OrderDetails = {
  id: string;
  specId: string;
  qualityName: string;
  millName: string;
  breadth: number;
  length: number;
  weight: number;
  gsm: number;
  sheets: number;
  rate: number;
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

const Row = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const IconRow = styled("div", {
  width: "fit-content",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
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

  const { data, isLoading, refetch } = trpc.orders.getOrderById.useQuery(id);
  const { mutateAsync: deleteOrderById } =
    trpc.orders.deleteOrder.useMutation();

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
      id: stockOrder.id,
      specId: stockOrder.stock.specs.id,
      qualityName: stockOrder.stock.specs.qualityName,
      millName: stockOrder.stock.specs.quality.millName,
      breadth: stockOrder.stock.specs.breadth,
      length: stockOrder.stock.specs.length,
      weight: stockOrder.stock.specs.weight,
      gsm: stockOrder.stock.specs.gsm,
      sheets: stockOrder.stock.specs.sheets,
      rate: stockOrder.rate,
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

    console.log("Filtered Arr: ", filteredArr);

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

    console.log("Reduced Arr: ", stats);

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
      width: "150px",
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
      title: "Rate",
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

  const deleteOrder = async () => {
    const DeletePromise = deleteOrderById(orderDetails.orderId);
    toast.promise(DeletePromise, {
      loading: "Deleting Order",
      success: "Order Deleted",
      error: "Error Deleting Order",
    });
    await DeletePromise;
    router.push("/orders");
  };

  return (
    <>
      <Wrapper>
        <Row>
          <Text type="LargeBold">Order Details</Text>
          <IconRow>
            <Button
              leftIcon={<TbEdit size={16} />}
              variant="outline"
              color="blue"
              onClick={() => {}}
            >
              Edit
            </Button>
            <Button
              leftIcon={<TbTrash size={16} />}
              variant="outline"
              color="red"
              onClick={deleteOrder}
            >
              Delete
            </Button>
          </IconRow>
        </Row>
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
          <OrderDetailTable refetch={refetch} data={item} key={item.specId} />
        ))}
      </Wrapper>
    </>
  );
};

export default OrderIdPage;
