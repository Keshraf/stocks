import {
  Autocomplete,
  Button as MantineButton,
  Loader,
  Modal,
  TextInput,
} from "@mantine/core";
import { Button } from "~/components/UI/Buttons";
import { useEffect, useState } from "react";
import { styled } from "stitches.config";
import SpecsChange from "~/components/ChangeGroup/SpecsChange";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import {
  clearAddStock,
  setAllAddStockClient,
  setAllAddStockInvoice,
} from "~/store/selectedAddStock";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
import { resetSelectedSpecs } from "~/store/selectedSpecs";
import { toast } from "react-hot-toast";
import { AddStockSchema, type AddStock } from "~/types/stocks";
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

const ModalWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapLarge",
});

const InfoWrapper = styled("div", {
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
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

type formInputData = {
  quantity: number;
  transit: number;
  ordered: number;
  bundle: number;
};

const StockAddPage = () => {
  const selectedStock = useAppSelector((state) => state.selectedAddStock);
  const dispatch = useAppDispatch();

  const [opened, setOpened] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [disableInvoice, setDisableInvoice] = useState<boolean>(false);
  const [disableClient, setDisableClient] = useState<boolean>(false);

  const router = useRouter();

  const { mutateAsync: addStock } = trpc.stocks.addStock.useMutation();
  const { data: clientData, isLoading: clientLoading } =
    trpc.clients.getClients.useQuery();

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(clearAddStock());
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

  const getClientNames = () => {
    const clientNames: string[] = [];
    clientData.forEach((client) => clientNames.push(client.name));
    return clientNames;
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
      title: "Godown Order",
      width: "100px",
    },
    {
      title: "Client Order",
      width: "100px",
    },
    {
      title: "Rate",
      width: "100px",
    },
    {
      title: "Client",
      width: "150px",
    },
    {
      title: "Order No.",
      width: "150px",
    },
  ];

  const submitHandler = async () => {
    if (selectedStock.length === 0) {
      toast.error("No Stocks Selected", {
        position: "top-right",
      });
      return;
    }

    const data: any[] = [];
    selectedStock.forEach((stock) => {
      if (stock.godownOrder > 0) {
        const copyStock: any = { ...stock };
        copyStock.quantity = stock.godownOrder;
        copyStock.mill = stock.millName;
        delete copyStock.godownOrder;
        delete copyStock.clientOrder;
        delete copyStock.client;
        delete copyStock.millName;

        data.push({
          ...copyStock,
        });
      }
      if (stock.clientOrder > 0) {
        const copyStock: any = { ...stock };
        copyStock.quantity = stock.clientOrder;
        copyStock.mill = stock.millName;
        delete copyStock.godownOrder;
        delete copyStock.clientOrder;
        delete copyStock.millName;

        data.push({
          ...copyStock,
        });
      }
    });

    console.log(data);

    const result = z.array(AddStockSchema).safeParse(data);
    if (!result.success) {
      console.log(result);
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);
      const AddStockPromise = addStock(result.data);

      toast.promise(AddStockPromise, {
        loading: "Adding Stocks...",
        success: "Stocks Added",
        error: "Error Adding Stocks",
      });

      AddStockPromise.then(() => {
        dispatch(clearAddStock());
        dispatch(resetSelectedSpecs());
      }).catch(() => {
        console.log("Error");
      });
    }
  };

  return (
    <Wrapper>
      {/* MODAL START */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set these for all"
      >
        <ModalWrapper>
          <InputWrapper>
            <Text type="MediumBold">Order No.</Text>

            <TextInput
              value={invoice}
              onChange={(e) => setInvoice(e.target.value.trim())}
              placeholder="Enter Order No."
            />
            <MantineButton
              disabled={disableInvoice}
              onClick={() => {
                dispatch(setAllAddStockInvoice(invoice));
              }}
            >
              Apply for all
            </MantineButton>
          </InputWrapper>
          <InputWrapper>
            <Text type="MediumBold">Client</Text>
            <Autocomplete
              value={client}
              limit={20}
              maxDropdownHeight={300}
              onChange={(value) => setClient(value.trim())}
              placeholder="Choose Client"
              data={getClientNames()}
            />
            <MantineButton
              disabled={disableClient}
              onClick={() => {
                dispatch(setAllAddStockClient(client));
              }}
            >
              Apply for all
            </MantineButton>
          </InputWrapper>
        </ModalWrapper>
      </Modal>
      {/* MODAL END */}
      <InfoWrapper>
        <Text>Stock Add Page</Text>
        <Button onClick={() => setOpened(true)}>Set for all</Button>
      </InfoWrapper>
      <InfoWrapper>
        {headers.map((header, index) => {
          return (
            <InfoRow css={{ width: header.width }} key={index}>
              <Text type="SmallMedium">{header.title}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      {selectedStock.map((stock, index) => {
        return (
          <SpecsChange
            key={stock.id + index}
            stock={stock}
            clientList={getClientNames()}
            index={index}
          />
        );
      })}
      <DividerWrapper />
      <MantineButton onClick={submitHandler}>Submit</MantineButton>
    </Wrapper>
  );
};

export default StockAddPage;
