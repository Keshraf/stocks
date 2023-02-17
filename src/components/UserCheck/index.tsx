import { Loader } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { styled } from "stitches.config";
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
});

const UserCheck = ({ children }: { children: ReactNode }) => {
  const user = trpc.getMe.useQuery();
  const router = useRouter();

  switch (user.status) {
    case "loading": {
      return (
        <Main>
          <Loader />
        </Main>
      );
    }
    case "error": {
      router.push("/");
    }
    case "success": {
      return <>{children}</>;
    }
    default: {
      return (
        <Main>
          <Loader />
        </Main>
      );
    }
  }
};

export default UserCheck;
