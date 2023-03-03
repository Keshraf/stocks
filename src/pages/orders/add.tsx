import { Autocomplete, Divider, Loader, Modal, TextInput } from "@mantine/core";
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
import { resetSelectedSpecs, StockSchema } from "~/store/selectedSpecs";
import { CreateOrderSchema } from "~/types/orders";
import { trpc } from "~/utils/trpc";
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

const OrderAddPage = () => {
  const [opened, setOpened] = useState(true);
  const [invoice, setInvoice] = useState("");
  const [client, setClient] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const router = useRouter();
  const selectedStock = useAppSelector((state) => state.selectedSpecs);
  const dispatch = useAppDispatch();
  const { data: clientData, isLoading: clientLoading } =
    trpc.clients.getClients.useQuery();
  const { mutateAsync: createOrder } = trpc.orders.createOrder.useMutation();

  const getClientNames = useMemo(() => {
    if (!clientData) return [];
    const clientNames: string[] = [];
    clientData.forEach((client) => clientNames.push(client.name));
    return clientNames;
  }, [clientData]);

  const getClientAddress = useMemo(() => {
    if (!clientData) return [];
    const clientAddress: string[] = [];
    clientData.forEach((clientItem) => {
      if (clientItem.name === client) {
        clientAddress.push(...clientItem.address);
      }
    });
    return clientAddress;
  }, [clientData, client]);

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

  if (!clientData || clientLoading) {
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
    if (!client) {
      toast.error("Client is required");
      return;
    }
    if (getClientNames.indexOf(client) === -1) {
      toast.error("Client not found!");
      return;
    }

    if (invoice.length < 4) {
      toast.error("Invoice Code is too short!");
      return;
    }

    setOpened(false);
  };

  const submitHandler = async () => {
    console.log("submit");

    const mergedStocks = selectedStock
      .map((stock) => {
        if (!stock.stock || stock.stock.length === 0) return;

        return [...stock.stock];
      })
      .flat()
      .filter((item) => item !== undefined);

    const sortedStocks = selectedStock
      .map((stock) => {
        if (!stock.stock || stock.stock.length === 0) return;

        const bundles = { ...stock.bundleSelected };

        // Creates a copy of the array
        // sort edits the variables hence, we need to create a copy of the array
        const refStocks = [...stock.stock].sort((a, b) => {
          const aDate = new Date(a.createdAt).valueOf();
          const bDate = new Date(b.createdAt).valueOf();
          return aDate - bDate;
        });

        const statusArr: ("quantity" | "transit" | "ordered")[] = [
          "quantity",
          "transit",
          "ordered",
        ];

        const allChanges = statusArr
          .map((status) => {
            const changes = refStocks.map((item) => {
              const bundleQuanity = bundles[item.bundle];
              let value = item[status];
              if (bundleQuanity === 0 || !bundleQuanity || value === 0)
                return {
                  id: item.id,
                  [status]: 0,
                };
              let final: number;
              let reduced: number;
              if (bundleQuanity < value) {
                final = 0;
                reduced = bundleQuanity;
              } else {
                final = bundleQuanity - value;
                reduced = value;
              }
              bundles[item.bundle] = final;
              return {
                id: item.id,
                [status]: reduced,
              };
            });

            return changes;
          })
          .flat();

        const finalChanges = allChanges.map((change, index) => {
          const sameStuff = allChanges.filter((item) => item.id === change.id);
          if (index + 1 > allChanges.length / 3) return null;
          return sameStuff.reduce((acc, curr) => {
            return {
              ...acc,
              ...curr,
            };
          });
        });

        return finalChanges.filter((item) => item !== null);
      })
      .flat();

    const results = StockChangeSchema.safeParse(sortedStocks);

    if (!results.success) {
      toast.error("Something went wrong!");
      return;
    } else {
      const distributedStocks = results.data;
      const finalStocks = mergedStocks.map((stock) => {
        if (!stock) return null;
        const distributedStock = distributedStocks.find(
          (item) => item.id === stock.id
        );
        if (!distributedStock) return null;
        return {
          id: stock.id,
          quantity: stock.quantity - distributedStock.quantity,
          transit: stock.transit - distributedStock.transit,
          ordered: stock.ordered - distributedStock.ordered,
          pending:
            distributedStock.quantity +
            distributedStock.transit +
            distributedStock.ordered,
        };
      });

      const reducedStocks = finalStocks.filter((item) => {
        if (item === null) return false;
        if (item.pending === 0) return false;
        return true;
      });

      const data = {
        orderId: invoice,
        billingAddress,
        shippingAddress,
        clientName: client,
        stocks: reducedStocks,
      };
      const results2 = CreateOrderSchema.safeParse(data);

      if (!results2.success) {
        results2.error.errors.map((e) =>
          toast.error(e.message, {
            position: "top-right",
          })
        );
      } else {
        const orderData = results2.data;
        const CreateOrderPromise = createOrder(orderData);

        toast.promise(CreateOrderPromise, {
          loading: "Creating Order...",
          success: "Order Created",
          error: "Error Creating Order",
        });

        CreateOrderPromise.then(() => {
          dispatch(resetSelectedSpecs());
          router.push("/orders");
        }).catch(() => {
          console.log("Error");
        });
      }
    }
  };

  return (
    <Wrapper>
      {/* MODAL START */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set these for all"
        withCloseButton={false}
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        <ModalWrapper onSubmit={modalSubmitHandler}>
          <InputWrapper>
            <Text type="MediumBold">Invoice Code</Text>

            <TextInput
              value={invoice}
              onChange={(e) => setInvoice(e.target.value.trim())}
              placeholder="Enter Invoice Code"
            />
          </InputWrapper>
          <InputWrapper>
            <Text type="MediumBold">Client</Text>
            <Autocomplete
              value={client}
              limit={20}
              maxDropdownHeight={300}
              onChange={(value) => setClient(value.trim())}
              placeholder="Choose Client"
              data={getClientNames}
            />
          </InputWrapper>
          <ActionButton type="submit">Confirm</ActionButton>
        </ModalWrapper>
      </Modal>
      {/* MODAL END */}
      <Text>Place Order</Text>
      <Row>
        <Text type="MediumRegular">Invoice Code:</Text>
        <Text type="MediumBold">{invoice}</Text>
      </Row>
      <Row>
        <Text type="MediumRegular">Client:</Text>
        <Text type="MediumBold">{client}</Text>
      </Row>
      <DividerWrapper />
      <Text type="ExtralargeBold">Selected Specs</Text>
      {selectedStock.map((stock) => {
        return <StockItemChange stock={stock} key={stock.id} />;
      })}
      <Divider />
      <Row>
        <InputWrapper>
          {/* <Text type="MediumBold">Billing Address</Text> */}
          <Autocomplete
            label="Billing Address"
            withAsterisk
            value={billingAddress}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => setBillingAddress(value)}
            placeholder="Choose Billing Address"
            data={getClientAddress}
          />
        </InputWrapper>
        <InputWrapper>
          {/* <Text type="MediumBold">Shipping Address</Text> */}
          <Autocomplete
            label="Shipping Address"
            withAsterisk
            value={shippingAddress}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => setShippingAddress(value)}
            placeholder="Choose Shipping Address"
            data={getClientAddress}
          />
        </InputWrapper>
      </Row>
      <Row>
        <ActionButton onClick={submitHandler}>Confirm Order</ActionButton>
        <Button onClick={() => router.push("/stocks")}>Go Back</Button>
      </Row>
    </Wrapper>
  );
};

export default OrderAddPage;
