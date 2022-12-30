import { Switch } from "@mantine/core";
import { useState } from "react";
import { styled } from "stitches.config";
import { ActionButton, Button } from "~/components/UI/Buttons";
import { flex } from "~/components/UI/Flex";
import Text, { DefaultText } from "~/components/UI/Text";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

const Page = styled("section", {
  width: "100%",
  height: "auto",
  minHeight: "100vh",
  padding: "40px",
  center: true,
  flexDirection: "column",
  gap: "$gapXLarge",
  backgroundColor: "$background",
  overflowY: "auto",
});

const Home = () => {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Head>
        <title>Balaji Khata</title>
      </Head>
      <Page>
        <div className={flex({ direction: "column", gap: "extralarge" })}>
          <Image src="/Logo.svg" alt="Logo" width={75} height={75} />
          <DefaultText weight="bold" css={{ fontSize: "68px" }}>
            Balaji Stock
          </DefaultText>
          <Text type="LargeSemibold">
            The One stop solution to manage your stocks.
          </Text>
        </div>
        <div>
          <Switch
            color="dark"
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            onLabel="Team"
            offLabel="User"
            size="xl"
          />
        </div>
        {!checked ? (
          <div className={flex({ gap: "large" })}>
            <ActionButton href="/auth/signup/user" as={Link}>
              Create an Account
            </ActionButton>
            <Button href="/auth/signin/user" as={Link}>
              Log In
            </Button>
          </div>
        ) : (
          <div className={flex({ gap: "large" })}>
            <Button href="/auth/signin/worker" as={Link}>
              Log in to your Organisation
            </Button>
          </div>
        )}
      </Page>
    </>
  );
};

Home.removeNav = true;

export default Home;
