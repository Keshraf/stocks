import { ReactNode } from "react";
import { styled } from "../../../stitches.config";
import ActionHeader from "./components/ActionHeader";
import Navigation from "./components/Navigation";

const Page = styled("section", {
  width: "100%",
  height: "auto",
  minHeight: "100vh",
  paddingTop: "50px",
  paddingLeft: "65px",
  paddingRight: "65px",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
  backgroundColor: "$background",
});

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Page>
      <Navigation />
      <ActionHeader />
      {children}
    </Page>
  );
};

export default Layout;
