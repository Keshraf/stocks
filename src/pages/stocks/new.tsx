import { Autocomplete, Loader, NumberInput, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import { ActionButton, Button } from "~/components/UI/Buttons";
import Text from "~/components/UI/Text";
import { AddPreorderInput, AddPreorderSchema } from "~/types/preorder";
import { AddStock, AddStockSchemaArr } from "~/types/stocks";
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

const Row = styled("div", {
  width: "100%",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "$gapMedium",
});

const StockNewPage = () => {
  const router = useRouter();

  const [millName, setMillName] = useState<string>("");
  const [qualityName, setQualityName] = useState<string>("");
  const [breadth, setBreadth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [gsm, setGsm] = useState<number>(0);
  const [bundle, setBundle] = useState<number>(0);
  const [sheets, setSheets] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [clientQuantity, setClientQuantity] = useState<number>(0);
  const [invoice, setInvoice] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [rate, setRate] = useState<number>(0);

  const { data, isLoading } = trpc.mills.getMills.useQuery();
  const { mutateAsync: addStock } = trpc.stocks.addStock.useMutation();
  const { mutateAsync: addPreorder } = trpc.preorder.addPreorder.useMutation();
  const { data: clientData, isLoading: clientLoading } =
    trpc.clients.getClients.useQuery();

  if (!data || isLoading || !clientData || clientLoading) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  const getMillNames = () => {
    const millNames: string[] = [];
    data.forEach((mill) => millNames.push(mill.name));
    return millNames;
  };

  const getQualityNames = () => {
    return data
      .map((mill) => {
        if (mill.name !== millName && millName !== "") {
          return [];
        }
        return mill.quality.map((quality) => {
          return {
            value: quality.name,
            group: mill.name,
          };
        });
      })
      .flat();
  };

  const getClientNames = () => {
    const clientNames: string[] = [];
    clientData.forEach((client) => clientNames.push(client.name));
    return clientNames;
  };

  const NumberInputs = [
    {
      variable: breadth,
      setVariable: setBreadth,
      label: "Breadth",
      placeholder: "Enter Breadth",
      precision: 2,
    },
    {
      variable: length,
      setVariable: setLength,
      label: "Length",
      placeholder: "Enter Length",
      precision: 2,
    },
    {
      variable: weight,
      setVariable: setWeight,
      label: "Weight",
      placeholder: "Enter Weight",
      precision: 2,
    },
    {
      variable: gsm,
      setVariable: setGsm,
      label: "GSM",
      placeholder: "Enter GSM",
      precision: 0,
    },
    {
      variable: sheets,
      setVariable: setSheets,
      label: "Sheets",
      placeholder: "Enter Sheets",
      precision: 0,
    },
    {
      variable: quantity,
      setVariable: setQuantity,
      label: "Godown Order",
      placeholder: "Enter Godown Packets",
      precision: 0,
    },
    {
      variable: clientQuantity,
      setVariable: setClientQuantity,
      label: "Client Order",
      placeholder: "Enter Client Packets",
      precision: 0,
    },
    {
      variable: rate,
      setVariable: setRate,
      label: "Rate",
      placeholder: "Enter Rate",
      precision: 0,
    },
  ];

  const addStockHandler = async () => {
    const stock: AddStock = {
      mill: millName,
      qualityName,
      breadth,
      length,
      gsm,
      sheets,
      weight,
      invoice,
      quantity: quantity + clientQuantity,
      rate,
    };

    const preorderData = {
      client: client ? client : "",
      invoiceName: invoice,
      quantity: clientQuantity,
      breadth,
      length,
      gsm,
      sheets,
      weight,
      qualityName,
      status: "pending",
    } as AddPreorderInput;

    const result = AddStockSchemaArr.safeParse([stock]);
    const preorderResult = AddPreorderSchema.safeParse(preorderData);
    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);
      const AddStockPromise = addStock(result.data);

      toast.promise(AddStockPromise, {
        loading: "Adding Stock...",
        success: "Stock Added",
        error: "Error Adding Stock",
      });

      AddStockPromise.then(async () => {
        router.push("/stocks");

        if (!preorderResult.success) {
          return;
        }
        const AddPreorderPromise = await addPreorder(
          [preorderResult.data].filter(
            (preorder) => preorder.quantity > 0 && preorder.client !== ""
          )
        );

        toast.success("Preorder Added");
      }).catch(() => {
        console.log("Error Adding Stock");
      });
    }
  };

  return (
    <>
      <Wrapper>
        <Text type="LargeBold">Stock Add Page</Text>
        <InputWrapper>
          <Text type="MediumBold">Mill Name</Text>
          <Autocomplete
            value={millName}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => setMillName(value.toUpperCase())}
            placeholder="Choose Mill"
            data={getMillNames()}
          />
        </InputWrapper>
        <InputWrapper>
          <Text type="MediumBold">Quality Name</Text>
          <Autocomplete
            value={qualityName}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => setQualityName(value.toUpperCase())}
            placeholder="Choose Quality"
            data={getQualityNames()}
          />
        </InputWrapper>
        {NumberInputs.map((input) => {
          return (
            <InputWrapper key={input.label}>
              <Text type="MediumBold">{input.label}</Text>
              <NumberInput
                value={input.variable}
                onChange={(value) => input.setVariable(value ? value : 0)}
                placeholder={input.placeholder}
                step={0.5}
                precision={input.precision}
              />
            </InputWrapper>
          );
        })}
        <InputWrapper>
          <Text type="MediumBold">Order No.</Text>
          <TextInput
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Your Order No."
            withAsterisk
          />
        </InputWrapper>
        <InputWrapper>
          <Text type="MediumBold">Client</Text>
          <Autocomplete
            value={client}
            limit={20}
            maxDropdownHeight={300}
            onChange={(value) => setClient(value)}
            placeholder="Choose Client"
            data={getClientNames()}
          />
        </InputWrapper>
        <Row style={{ justifyContent: "flex-start" }}>
          <ActionButton onClick={addStockHandler}>
            {"Confirm Stock Details"}
          </ActionButton>
          <Button onClick={() => router.push("/stocks")}>Go Back</Button>
        </Row>
      </Wrapper>
    </>
  );
};

export default StockNewPage;
