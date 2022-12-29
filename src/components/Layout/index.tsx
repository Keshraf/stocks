import { ReactNode } from "react";
import { styled } from "../../../stitches.config";
import Navigation from "./components/Navigation";

const Page = styled("section", {
  width: "100%",
  height: "auto",
  minHeight: "100vh",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
  backgroundColor: "$background",
  overflowY: "auto",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Page>
      <Navigation />
      {children}
    </Page>
  );
};

export default Layout;
