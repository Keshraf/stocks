import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import { z } from "zod";
import { ActionButton, Button } from "~/components/UI/Buttons";
import { Input } from "~/components/UI/Input";
import Text from "~/components/UI/Text";
import {
  ClientWithIdSchema,
  ClientWithIdType,
  NewClientSchema,
  NewClientType,
} from "~/types/clients";
import { trpc } from "~/utils/trpc";

const Main = styled("main", {
  width: "100%",
  height: "auto",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapXLarge",
});

const InputWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const RedSpan = styled("span", {
  color: "red",
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

const NewClientPage = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<string[]>([]);
  const [inputAddress, setInputAddress] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [gst, setGst] = useState<string>("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [id, setId] = useState<string>("");

  const addClient = trpc.clients.addClient.useMutation();
  const updateClient = trpc.clients.updateClientById.useMutation();
  const { data: clientData, isLoading: clientIsLoading } =
    trpc.clients.getClientById.useQuery({ id });

  const addAddress = () => {
    if (!inputAddress) return;
    if (addresses.includes(inputAddress)) {
      toast.error("Address already added");
      return;
    }

    setAddresses((prev) => [...prev, inputAddress]);
    setInputAddress("");
  };

  const removeAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const addClientHandler = () => {
    const client: NewClientType = {
      name,
      mobile,
      email,
      gst,
      address: addresses,
    };

    const result = NewClientSchema.safeParse(client);
    console.log(result);
    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);

      const ClientPromise = addClient.mutateAsync(result.data);

      toast.promise(ClientPromise, {
        loading: "Adding Client...",
        success: "Client Added",
        error: "Error Adding Client",
      });

      ClientPromise.then(() => {
        router.push("/clients");
      });
    }
  };

  const updateClientHandler = () => {
    const client: ClientWithIdType = {
      name,
      mobile,
      email,
      gst,
      address: addresses,
      id,
    };

    const result = ClientWithIdSchema.safeParse(client);

    if (!result.success) {
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);
      const ClientPromise = updateClient.mutateAsync(result.data);

      toast.promise(ClientPromise, {
        loading: "Updating Client...",
        success: "Client Updated",
        error: "Error Updating Client",
      });

      ClientPromise.then(() => {
        router.push("/clients");
      });
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      if (typeof id !== "string") return;
      setId(id);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!clientData || !clientData.id) return;

    setName(clientData.name ? clientData.name : "");
    setMobile(clientData.mobile ? clientData.mobile.toString() : "");
    setEmail(clientData.email ? clientData.email : "");
    setGst(clientData.gst ? clientData.gst : "");
    setAddresses(clientData.address ? clientData.address : []);
    setMode("edit");
  }, [clientData]);

  return (
    <Main>
      <Text type="LargeBold">
        {mode === "add" ? "Add New Client" : "Update Client"}
      </Text>
      <InputWrapper>
        <Text type="MediumSemibold">
          {"Name"}
          <RedSpan>*</RedSpan>
        </Text>
        <Input
          type="text"
          placeholder="Enter Client's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <Text type="MediumSemibold">{"Mobile"}</Text>
        <Input
          type="tel"
          placeholder="Enter Client's Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <Text type="MediumSemibold">{"Email"}</Text>
        <Input
          type="email"
          placeholder="Enter Client's Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <Text type="MediumSemibold">{"GST ID"}</Text>
        <Input
          type="text"
          placeholder="Enter Client's GST ID"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <Text type="MediumSemibold">
          {"Address"}
          <RedSpan>*</RedSpan>
        </Text>
        <Row>
          <Input
            type="text"
            placeholder="Enter Client's Address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
          />
          <ActionButton size={"fit"} onClick={addAddress}>
            +
          </ActionButton>
        </Row>
        {addresses.map((address, index) => {
          if (!address) return null;
          return (
            <Row key={index}>
              <Input as="div">{address}</Input>
              <Button size={"fit"} onClick={() => removeAddress(index)}>
                -
              </Button>
            </Row>
          );
        })}
      </InputWrapper>
      <Row style={{ justifyContent: "flex-start" }}>
        <ActionButton
          onClick={mode === "add" ? addClientHandler : updateClientHandler}
        >
          {mode === "add" ? "Confirm Client Details" : "Confirm Update"}
        </ActionButton>
        <Button onClick={() => router.push("/clients")}>Go Back</Button>
      </Row>
    </Main>
  );
};

export default NewClientPage;
