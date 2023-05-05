import {
  Autocomplete,
  Divider,
  Group,
  Loader,
  Modal,
  Radio,
  TextInput,
} from "@mantine/core";
import { useRouter } from "next/router";
import {
  FormEvent,
  FormEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import StockItemChange from "~/components/ChangeGroup/StockItemChange";
import { ActionButton, Button } from "~/components/UI/Buttons";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import { resetSelectedSpecs } from "~/store/selectedSpecs";
import {
  CreateOrderSchema,
  CreateOrderType,
  CreateStockOrderSchema,
  CreateStockOrderType,
} from "~/types/orders";
import { trpc } from "~/utils/trpc";
import Datepicker from "~/components/DatePicker";
import { z } from "zod";

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

const InputWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const ModalWrapper = styled("form", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapLarge",
});

const Row = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
});

const StockChangeSchema = z.array(
  z.object({
    id: z.string(),
    quantity: z.number(),
    transit: z.number(),
    ordered: z.number(),
  })
);

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

const InfoWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
  overflowX: "auto",
  overflowY: "hidden",
});

const InfoRow = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const OrderAddPage = () => {
  const [opened, setOpened] = useState(true);
  const [addressOpened, setAddressOpened] = useState(false);
  const [clientChanged, setClientChanged] = useState<string>("");
  const [newAddress, setNewAddress] = useState<string>("");
  const [invoice, setInvoice] = useState("");
  const [billingClient, setBillingClient] = useState("");
  const [shippingClient, setShippingClient] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [radioValue, setRadioValue] = useState<string>("new");

  const router = useRouter();

  const selectedStock = useAppSelector((state) => state.selectedSpecs);
  const dispatch = useAppDispatch();

  const {
    data: clientData,
    isLoading: clientLoading,
    refetch: refetchClientData,
  } = trpc.clients.getClients.useQuery();
  const { mutateAsync: createOrder } = trpc.orders.createOrder.useMutation();
  const { mutateAsync: createStockOrder } =
    trpc.orders.createStockOrder.useMutation();
  const { data: invoiceData, isLoading: invoiceLoading } =
    trpc.invoices.getInvoices.useQuery();
  const { mutateAsync: addNewClientAddress } =
    trpc.clients.addClientAddress.useMutation();

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

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(resetSelectedSpecs());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, dispatch]);

  if (!clientData || clientLoading || !invoiceData || invoiceLoading) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  const modalSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!invoice) {
      toast.error("Invoice Code is required");
      return;
    }
    if (!billingClient) {
      toast.error("Client is required");
      return;
    }
    if (getClientNames.indexOf(billingClient) === -1) {
      toast.error("Client not found!");
      return;
    }

    if (invoice.length < 4) {
      toast.error("Invoice Code is too short!");
      return;
    }

    setOpened(false);
  };

  const headers = [
    {
      title: "Mill",
      width: "30px",
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
      width: "50px",
    },
    {
      title: "GSM",
      width: "50px",
    },
    {
      title: "Sheets",
      width: "50px",
    },
    {
      title: "Godown",
      width: "75px",
    },
    {
      title: "Transit",
      width: "75px",
    },
    {
      title: "Ordered",
      width: "75px",
    },
    {
      title: "Total",
      width: "75px",
    },
    {
      title: "Quantity <PKT>",
      width: "100px",
    },
    {
      title: "Rate <₹>",
      width: "100px",
    },
  ];

  const submitHandler = async () => {
    console.log("submit");
    if (radioValue === "new" && (!billingClient || !shippingClient)) {
      toast.error("Client or Address is missing");
      return;
    }
    if (!invoice) {
      toast.error("Invoice Code is required");
      return;
    }

    const orders: CreateStockOrderType[] = [];

    selectedStock.forEach(async (item) => {
      let quantity = item.quantity;

      if (quantity === 0 || item.stock?.length === 0) return;

      // Reduces the client order quantity from the stock

      if (!item.stock) return;

      console.log(item.stock);

      const sortedOrders = item.stock
        .slice()
        .sort(
          (a, b) =>
            Date.parse(a.createdAt.toDateString()) -
            Date.parse(b.createdAt.toDateString())
        );

      const quantityReduced = sortedOrders.map((stockItem) => {
        if (quantity === 0)
          return {
            stockId: stockItem.id,
            quantity: 0,
          };
        let orderQuantity = 0;
        orderQuantity =
          quantity > stockItem.quantity ? stockItem.quantity : quantity;
        quantity -= orderQuantity;

        return {
          stockId: stockItem.id,
          quantity: orderQuantity,
        };
      });

      const transitReduced = sortedOrders.map((stockItem) => {
        if (quantity === 0)
          return {
            stockId: stockItem.id,
            transit: 0,
          };
        let orderQuantity = 0;
        orderQuantity =
          quantity > stockItem.transit ? stockItem.transit : quantity;
        quantity -= orderQuantity;

        return {
          stockId: stockItem.id,
          transit: orderQuantity,
        };
      });

      const orderedReduced = sortedOrders.map((stockItem) => {
        if (quantity === 0)
          return {
            stockId: stockItem.id,
            ordered: 0,
          };
        let orderQuantity = 0;
        orderQuantity =
          quantity > stockItem.ordered ? stockItem.ordered : quantity;
        quantity -= orderQuantity;

        return {
          stockId: stockItem.id,
          ordered: orderQuantity,
        };
      });

      const totalReduced = sortedOrders
        .map((_, index) => {
          return {
            ...quantityReduced[index],
            ...transitReduced[index],
            ...orderedReduced[index],
            rate: item.rate,
          };
        })
        .map((item) => {
          item.quantity = item.quantity ? item.quantity : 0;
          item.transit = item.transit ? item.transit : 0;
          item.ordered = item.ordered ? item.ordered : 0;

          return {
            quantity: item.quantity + item.transit + item.ordered,
            rate: item.rate,
            stockId: item.stockId ? item.stockId : "wtf",
            orderId: invoice,
          };
        })
        .filter((item) => item.quantity > 0);

      console.log(item);
      console.log(totalReduced);
      orders.push(...totalReduced);
    });

    console.log("Orders", orders);

    if (radioValue === "new") {
      const orderDetails: CreateOrderType = {
        billingAddress: billingAddress ? billingAddress : "",
        shippingAddress: shippingAddress ? shippingAddress : "",
        clientName: billingClient,
        shippingClientName: shippingClient,
        orderDate: date ? date : new Date(),
        orderId: invoice,
      };

      // First Create an Order
      const orderResults = CreateOrderSchema.safeParse(orderDetails);

      if (!orderResults.success) {
        toast.error("Error in Order");
        return;
      } else {
        console.log("ORDER : ", orderResults.data);
        const CreateOrderPromise = createOrder(orderResults.data);

        toast.promise(CreateOrderPromise, {
          loading: "Creating Order",
          success: "Order Created",
          error: "Error in Order",
        });

        await CreateOrderPromise;
      }
    }

    // Then Create Stock Orders

    const stockOrderResults = z.array(CreateStockOrderSchema).safeParse(orders);
    if (!stockOrderResults.success) {
      toast.error("Error in Stock Order");
      return;
    } else {
      console.log("STOCK ORDER : ", stockOrderResults.data);

      const CreateStockOrderPromise = createStockOrder(stockOrderResults.data);

      toast.promise(CreateStockOrderPromise, {
        loading: "Allocating Stocks",
        success: "Stocks Allocated",
        error: "Error in Stock Order",
      });

      await CreateStockOrderPromise.then(() => {
        dispatch(resetSelectedSpecs());
        router.push("/orders");
      });
    }
  };

  const addAddressHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!clientChanged) return;
    if (!newAddress) return;
    if (!getClientNames.includes(clientChanged)) {
      toast.error("Client not found");
      return;
    }

    try {
      const AddNewAddressPromise = addNewClientAddress({
        client: clientChanged,
        address: newAddress,
      }).then(() => {
        setNewAddress("");
        setClientChanged("");
        setAddressOpened(false);
      });

      toast.promise(AddNewAddressPromise, {
        loading: "Adding Address",
        success: "Address Added",
        error: "Error in Adding Address",
      });

      await AddNewAddressPromise;
      await refetchClientData();
    } catch (error) {
      toast.error("Error in Adding Address");
    }
  };

  return (
    <Wrapper>
      <Modal
        opened={addressOpened}
        onClose={() => setAddressOpened(false)}
        title="Set Address"
      >
        <ModalWrapper onSubmit={addAddressHandler}>
          <Text>{clientChanged}</Text>
          <InputWrapper>
            <Text type="MediumBold">New Address</Text>
            <TextInput
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter New Address"
            />
          </InputWrapper>
          <ActionButton type="submit">Confirm</ActionButton>
        </ModalWrapper>
      </Modal>
      {/* ADDRESS MODAL END */}
      <InfoWrapper>
        <Text>Place Order</Text>
      </InfoWrapper>

      <DividerWrapper />
      <InfoWrapper>
        {headers.map((header, index) => {
          return (
            <InfoRow css={{ width: header.width }} key={index}>
              <Text type="SmallMedium">{header.title}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      {selectedStock.map((stock) => {
        return <StockItemChange stock={stock} key={stock.id} />;
      })}
      <Divider />
      <Radio.Group
        name="order"
        withAsterisk
        value={radioValue}
        onChange={setRadioValue}
      >
        <Group mt="xs">
          <Radio value="new" label="New Order" />
          <Radio value="old" label="Existing Order" />
        </Group>
      </Radio.Group>
      <InputWrapper>
        <TextInput
          label="Invoice Code"
          value={invoice}
          onChange={(e) => setInvoice(e.target.value)}
          placeholder="Enter Invoice Code"
          withAsterisk
        />
      </InputWrapper>
      {radioValue === "new" && (
        <>
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
                  if (value === "+ Add New Address") {
                    if (billingClient) {
                      setClientChanged(billingClient);
                      setAddressOpened(true);
                    }
                    return;
                  } else {
                    setBillingAddress(value);
                  }
                }}
                placeholder="Choose Billing Address"
                data={[...getClientAddress(billingClient), "+ Add New Address"]}
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
                  if (value === "+ Add New Address") {
                    if (shippingClient) {
                      setClientChanged(shippingClient);
                      setAddressOpened(true);
                    }
                    return;
                  } else {
                    setShippingAddress(value);
                  }
                }}
                placeholder="Choose Shipping Address"
                data={[
                  ...getClientAddress(shippingClient),
                  "+ Add New Address",
                ]}
              />
            </InputWrapper>
          </Row>
          <InfoRow>
            <Text type="MediumRegular">Delivery Date</Text>
            <Datepicker date={date} setDate={setDate} />
          </InfoRow>
        </>
      )}
      <Row>
        <ActionButton onClick={submitHandler}>Confirm Order</ActionButton>
        <Button onClick={() => router.push("/stocks")}>Go Back</Button>
      </Row>
    </Wrapper>
  );
};

export default OrderAddPage;
