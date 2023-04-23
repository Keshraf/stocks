import { Button, Loader, Tabs } from "@mantine/core";
import { useRouter } from "next/router";
import { styled, theme } from "stitches.config";
import StockItemTable from "~/components/Table/StockItemTable";
import Text from "~/components/UI/Text";
import { trpc } from "~/utils/trpc";
import { TbEdit, TbTrash } from "react-icons/tb";
import { toast } from "react-hot-toast";

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

const StockIdPage = () => {
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
  const { data, isLoading } = trpc.stocks.getSpecById.useQuery(id);
  const { mutateAsync: deleteSpecsById } =
    trpc.stocks.deleteSpecs.useMutation();

  if (isLoading || !data)
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );

  console.log(data);

  const Header = [
    {
      label: "Mill",
      value: data.quality.millName,
    },
    {
      label: "Quality",
      value: data.qualityName,
    },
    {
      label: "Size",
      value: `${data.breadth}${data.length ? ` X ${data.length}` : ""}`,
    },
    {
      label: "GSM",
      value: `${data.gsm} G`,
    },
    {
      label: "Weight",
      value: `${data.weight} KG`,
    },
    {
      label: "Sheets",
      value: `${data.sheets} S`,
    },
  ];

  const deleteHandler = async () => {
    const DeletePromise = deleteSpecsById(id);
    toast.promise(DeletePromise, {
      loading: "Deleting...",
      success: "Deleted",
      error: "Error",
    });
    await DeletePromise;
    router.push("/stocks");
  };

  return (
    <>
      <Wrapper>
        <Row>
          <Text type="LargeBold">Stock Details</Text>
          <IconRow>
            <Button
              leftIcon={<TbEdit size={16} />}
              variant="outline"
              color="blue"
              onClick={() => router.push(`/stocks/${id}/update`)}
            >
              Edit
            </Button>
            <Button
              leftIcon={<TbTrash size={16} />}
              variant="outline"
              color="red"
              onClick={deleteHandler}
            >
              Delete
            </Button>
          </IconRow>
        </Row>
        <InfoWrapper>
          {Header.map((data, index) => {
            return (
              <InfoRow key={index + data.label}>
                <Text width="100px" type="MediumMedium">
                  {data.label}
                </Text>
                <Text type="MediumRegular">{data.value}</Text>
              </InfoRow>
            );
          })}
        </InfoWrapper>
        <Tabs
          style={{
            width: "100%",
          }}
          defaultValue="stock"
        >
          <Tabs.List>
            <Tabs.Tab value="stock">Stocks</Tabs.Tab>
            <Tabs.Tab value="client">Clients</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="stock" pt="xs">
            <StockItemTable data={data.stock} />
          </Tabs.Panel>
          <Tabs.Panel value="client" pt="xs">
            Client
          </Tabs.Panel>
        </Tabs>
      </Wrapper>
    </>
  );
};

export default StockIdPage;
