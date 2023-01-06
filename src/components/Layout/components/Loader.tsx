import { styled } from "stitches.config";
import { Loader } from "@mantine/core";

const Page = styled("section", {
  width: "100%",
  height: "auto",
  minHeight: "100vh",
  padding: "40px",
  center: true,
  gap: "$gapMedium",
  backgroundColor: "$background",
});

const LoaderPage = () => {
  return (
    <Page>
      <Loader size="xl" variant="bars" />
    </Page>
  );
};

export default LoaderPage;
