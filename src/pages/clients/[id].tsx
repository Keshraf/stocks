import { Button, Divider, Loader, Modal } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { styled, theme } from "stitches.config";
import { ActionButton } from "~/components/UI/Buttons";
import Text from "~/components/UI/Text";
import { trpc } from "~/utils/trpc";

const Wrapper = styled("main", {
  width: "50%",
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

const CenteredWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "$gapMedium",
});

const ContentWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const InfoRow = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "1px",
  backgroundColor: "$highlight",
});

const ClientIdPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [opened, setOpened] = useState(false);

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

  const { data, isLoading } = trpc.clients.getClientById.useQuery({ id });
  const { mutateAsync: deleteClient } =
    trpc.clients.deleteClientById.useMutation();

  if (isLoading || !data)
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );

  const ClientInfo = [
    {
      title: "Mobile",
      value: data.mobile ? Number(data.mobile) : "-",
    },
    {
      title: "Email",
      value: data.email ? data.email : "-",
    },
    {
      title: "GSTIN",
      value: data.gst ? data.gst : "-",
    },
  ];

  const deleteHandler = async () => {
    const DeletePromise = deleteClient({ id });

    toast.promise(DeletePromise, {
      loading: "Deleting Client",
      success: "Client Deleted",
      error: "Error Deleting Client",
    });

    DeletePromise.then(() => {
      router.push("/clients");
    });
  };

  const editClientHandler = () => {
    router.push(`/clients/new?id=${id}`);
  };

  return (
    <>
      {/* Delete Modal Start */}
      <Modal
        withCloseButton={false}
        size={"auto"}
        centered
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <CenteredWrapper>
          <Text type="LargeBold">Confirm Delete Client</Text>
          <Text width="400px" type="MediumRegular">
            Are you sure you want to delete this client? This action cannot be
            undone. All the data associated with this client will be deleted.
          </Text>
          <Button
            onClick={deleteHandler}
            fullWidth
            variant="light"
            color="red"
            radius="md"
            size="md"
          >
            Delete
          </Button>
        </CenteredWrapper>
      </Modal>
      {/* Modal Close */}
      <Wrapper>
        <Text type="LargeBold">{data.name}</Text>
        <ContentWrapper>
          <Text type="MediumBold">Client Info:</Text>
          <DividerWrapper />
          {ClientInfo.map((item, index) => {
            return (
              <InfoRow key={item.title}>
                <Text width="100px" type="MediumMedium">
                  {item.title}
                </Text>
                <Text type="MediumRegular">{item.value}</Text>
              </InfoRow>
            );
          })}
          <DividerWrapper />
        </ContentWrapper>
        <ContentWrapper>
          <Text width="100px" type="MediumMedium">
            {"Address"}
          </Text>
          {data.address.map((item, index) => {
            return (
              <InfoRow key={index}>
                <Text width="10px" type="MediumMedium">
                  {index + 1}.
                </Text>
                <Text type="MediumRegular">{item}</Text>
              </InfoRow>
            );
          })}
        </ContentWrapper>
        <InfoRow>
          <ActionButton onClick={editClientHandler}>Edit Client</ActionButton>
          <ActionButton type="danger" onClick={() => setOpened(true)}>
            Delete Client
          </ActionButton>
        </InfoRow>
      </Wrapper>
    </>
  );
};

export default ClientIdPage;
