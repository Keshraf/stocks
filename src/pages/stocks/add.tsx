import { Autocomplete, Button, Loader, Modal, TextInput } from "@mantine/core";
import { useState } from "react";
import { styled } from "stitches.config";
import SpecsChange from "~/components/ChangeGroup/SpecsChange";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import {
  selectedSchema,
  setAllClientSpecs,
  setAllInvoiceSpecs,
} from "~/store/selectedSpecs";
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
  const selectedStock = useAppSelector((state) => state.selectedSpecs);
  const [opened, setOpened] = useState<boolean>(true);
  const [invoice, setInvoice] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [disableInvoice, setDisableInvoice] = useState<boolean>(false);
  const [disableClient, setDisableClient] = useState<boolean>(false);
  const dispatch = useAppDispatch();

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
      {/* MODAL START */}
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
                dispatch(setAllInvoiceSpecs(invoice));
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
              onClick={() => {
                dispatch(setAllClientSpecs(client));
              }}
            >
              Apply for all
            </Button>
          </InputWrapper>
        </ModalWrapper>
      </Modal>
      {/* MODAL END */}
      <Text>Stock Add Page</Text>
      {selectedStock.map((stock, index) => {
        return (
          <SpecsChange
            key={stock.id + index}
            stock={stock}
            clientList={getClientNames()}
          />
        );
      })}
    </Wrapper>
  );
};

export default StockAddPage;
