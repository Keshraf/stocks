import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { styled } from "stitches.config";
import StockItemTable from "~/components/Table/StockItemTable";
import Text from "~/components/UI/Text";
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
      label: "Breadth",
      value: data.breadth,
    },
    {
      label: "Length",
      value: data.length,
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

  return (
    <>
      <Wrapper>
        <Text type="LargeBold">Stock Details</Text>
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
        <StockItemTable data={data.stock} />
      </Wrapper>
    </>
  );
};

export default StockIdPage;
