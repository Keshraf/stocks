import {
  Autocomplete,
  Button,
  Loader,
  Modal,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import StockAdd from "~/components/StockAdd";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import { removeStock, selectedSchema } from "~/store/selectedStock";
import { AddStockSchema } from "~/types/stocks";
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

type formInputData = {
  quantity: number;
  transit: number;
  ordered: number;
  bundle: number;
};

type AddData = selectedSchema & formInputData;

const StockAddPage = () => {
  const selectedStock = useAppSelector((state) => state.selectedStock);
  const [opened, setOpened] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [disableInvoice, setDisableInvoice] = useState<boolean>(false);
  const [disableClient, setDisableClient] = useState<boolean>(false);

  const { data: clientData, isLoading: clientLoading } =
    trpc.clients.getClients.useQuery();

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

  return (
    <Wrapper>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Set these for all"
      >
        <ModalWrapper>
          <InputWrapper>
            <Text type="MediumBold">Invoice</Text>

            <TextInput
              value={invoice}
              onChange={(e) => setInvoice(e.target.value.trim())}
              placeholder="Enter Invoice Code"
            />
            <Button
              disabled={disableInvoice}
              onClick={() => {
                setDisableInvoice(true);
              }}
            >
              Apply for all
            </Button>
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
            <Button
              disabled={disableClient}
              onClick={() => setDisableClient(true)}
            >
              Apply for all
            </Button>
          </InputWrapper>
        </ModalWrapper>
      </Modal>
      <Text>Stock Add Page</Text>
      {selectedStock.map((stock, index) => {
        return (
          <StockAdd
            key={stock.id + index}
            stock={stock}
            clientList={getClientNames()}
            invoiceCode={disableInvoice ? invoice : ""}
            clientName={disableClient ? client : ""}
          />
        );
      })}
    </Wrapper>
  );
};

export default StockAddPage;
