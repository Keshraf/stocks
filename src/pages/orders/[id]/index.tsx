import {
  Autocomplete,
  Button,
  Loader,
  Modal,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";

import { trpc } from "~/utils/trpc";
import { styled } from "stitches.config";
import Text from "~/components/UI/Text";
import OrderDetailTable from "~/components/Table/OrderDetailTable";
import { TbEdit, TbTrash } from "react-icons/tb";
import { toast } from "react-hot-toast";
import { FormEvent, useMemo, useState } from "react";
import Datepicker from "~/components/DatePicker";

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

const InputWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
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
  gap: "$gapMedium",
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

const Form = styled("form", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const OrderIdPage = () => {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [invoice, setInvoice] = useState("");
  const [billingClient, setBillingClient] = useState("");
  const [shippingClient, setShippingClient] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const { id } = router.query;

  const {
    data: clientData,
    isLoading: clientLoading,
    refetch: refetchClientData,
  } = trpc.clients.getClients.useQuery();

  const getClientNames = useMemo(() => {
    if (!clientData) return [];
    const clientNames: string[] = [];
    clientData.forEach((client) => clientNames.push(client.name));
    return clientNames;
  }, [clientData]);

  const getClientAddress = (cli: string) => {
    if (!clientData) return [];
    const clientAddress: string[] = [];
    clientData.forEach((clientItem) => {
      if (clientItem.name === cli) {
        clientAddress.push(...clientItem.address);
      }
    });
    return clientAddress;
  };

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
  const { mutateAsync: updateOrder } = trpc.orders.updateOrder.useMutation();

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
        ? new Date(orderDetails.orderDate).toDateString()
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

  const updateOrderHandler = async (e: FormEvent) => {
    e.preventDefault();

    const UpdatePromise = updateOrder({
      id,
      orderId: invoice,
      clientName: billingClient,
      shippingClientName: shippingClient,
      billingAddress: billingAddress,
      shippingAddress: shippingAddress,
      orderDate: date ? date : new Date(),
    });
    toast.promise(UpdatePromise, {
      loading: "Updating Order",
      success: "Order Updated",
      error: "Error Updating Order",
    });
    await UpdatePromise.then(() => {
      refetch();
      setOpened(false);
    });
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Update Order Item"
        centered
        size="xl"
      >
        <Form onSubmit={updateOrderHandler}>
          <InputWrapper>
            <Text type="MediumBold">Invoice Code</Text>
            <TextInput
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              placeholder="Enter Invoice Code"
            />
          </InputWrapper>
          <Row>
            <InputWrapper>
              <Autocomplete
                label="Billing Client"
                withAsterisk
                value={billingClient}
                limit={50}
                maxDropdownHeight={300}
                onChange={(value) => {
                  setBillingClient(value);
                  setBillingAddress("");
                }}
                placeholder="Choose Client"
                data={getClientNames}
              />
            </InputWrapper>
            <InputWrapper>
              <Autocomplete
                label="Billing Address"
                value={billingAddress}
                limit={20}
                maxDropdownHeight={300}
                onChange={(value) => {
                  setBillingAddress(value);
                }}
                placeholder="Choose Billing Address"
                data={[...getClientAddress(billingClient)]}
              />
            </InputWrapper>
          </Row>
          <Row>
            <InputWrapper>
              {/* <Text type="MediumBold">Billing Address</Text> */}
              <Autocomplete
                label="Shipping Client"
                withAsterisk
                value={shippingClient}
                limit={50}
                maxDropdownHeight={300}
                onChange={(value) => {
                  setShippingClient(value);
                  setShippingAddress("");
                }}
                placeholder="Choose Client"
                data={getClientNames}
              />
            </InputWrapper>
            <InputWrapper>
              {/* <Text type="MediumBold">Shipping Address</Text> */}
              <Autocomplete
                label="Shipping Address"
                value={shippingAddress}
                limit={20}
                maxDropdownHeight={300}
                onChange={(value) => {
                  setShippingAddress(value);
                }}
                placeholder="Choose Shipping Address"
                data={[...getClientAddress(shippingClient)]}
              />
            </InputWrapper>
          </Row>
          <InfoRow>
            <Text type="MediumRegular">Delivery Date</Text>
            <Datepicker date={date} setDate={setDate} />
          </InfoRow>
          <Button type="submit" color="blue">
            Submit
          </Button>
        </Form>
      </Modal>
      <Wrapper>
        <Row>
          <Text type="LargeBold">Order Details</Text>
          <IconRow>
            <Button
              leftIcon={<TbEdit size={16} />}
              variant="outline"
              color="blue"
              onClick={() => {
                setOpened(true);
                setInvoice(orderDetails.orderId);
                setBillingClient(orderDetails.clientName);
                setShippingClient(orderDetails.shippingClientName);
                setBillingAddress(orderDetails.billingAddress);
                setShippingAddress(orderDetails.shippingAddress);
                setDate(orderDetails.orderDate);
              }}
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
