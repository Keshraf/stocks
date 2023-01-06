import { useRouter } from "next/router";
import { ReactNode } from "react";
import { trpc } from "~/utils/trpc";
import { styled } from "../../../stitches.config";
import LoaderPage from "./components/Loader";
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
  const user = trpc.getMe.useQuery();
  const router = useRouter();

  switch (user.status) {
    case "loading": {
      return <LoaderPage />;
    }
    case "error": {
      router.push("/");
    }
    case "success": {
      return (
        <Page>
          <Navigation />
          {children}
        </Page>
      );
    }
    default: {
      return <LoaderPage />;
    }
  }
};

export default Layout;
