import { styled, theme } from "stitches.config";
import Text from "~/components/UI/Text";
import { flex } from "~/components/UI/Flex";
import { Input } from "~/components/UI/Input";
import { ActionButton } from "~/components/UI/Buttons";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { Badge } from "@mantine/core";
import Policy from "~/components/Policy";
import Logo from "~/components/Logo";
import Head from "next/head";
import { trpc } from "~/utils/trpc";
import { NewUserSchema, type NewUser } from "~/types/user";

const Page = styled("section", {
  width: "100%",
  height: "auto",
  minHeight: "100vh",
  padding: "40px",
  center: true,
  gap: "$gapMedium",
  backgroundColor: "$background",
  overflowY: "auto",
});

const Modal = styled("div", {
  width: "350px",
  height: "auto",
  padding: "32px",
  backgroundColor: "$white",
  column: true,
  border: "2px solid $highlight",
  borderRadius: "$roundLarge",
  gap: "$gapLarge",
});

const UserSignup = () => {
  const [name, setName] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [checked, setChecked] = useState<boolean>(false);

  const createUser = trpc.auth.createUser.useMutation();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!checked) {
      toast.error("Please accept terms of service");
      return;
    }
    const data: NewUser = {
      name,
      email,
      company,
      password,
      confirm,
    };
    const result = NewUserSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
    } else {
      console.log(data);
      const createdUser = await createUser.mutate(data);
      console.log("CREATED USER: ", createdUser);
    }
  };

  return (
    <>
      <Head>
        <title>Sign up - Balaji Khata</title>
      </Head>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: theme.colors.white.value,
            color: theme.colors.content.value,
          },
        }}
      />
      <Page>
        <Logo />
        <Modal>
          <div className={flex({ width: "full", justify: "center" })}>
            <div className={flex({ gap: "small" })}>
              <Text type="LargeBold">Sign Up</Text>
              <Badge size="lg" radius="md">
                User
              </Badge>
            </div>
          </div>
          <form
            className={flex({
              width: "full",
              gap: "extralarge",
              direction: "column",
            })}
            onSubmit={submitHandler}
          >
            <div
              className={flex({
                direction: "column",
                align: "start",
                width: "full",
                gap: "medium",
              })}
            >
              <Text type="SmallMedium">Full Name</Text>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div
              className={flex({
                direction: "column",
                align: "start",
                width: "full",
                gap: "medium",
              })}
            >
              <Text type="SmallMedium">Email Address</Text>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div
              className={flex({
                direction: "column",
                align: "start",
                width: "full",
                gap: "medium",
              })}
            >
              <Text type="SmallMedium">Company Name</Text>
              <Input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div
              className={flex({
                direction: "column",
                align: "start",
                width: "full",
                gap: "medium",
              })}
            >
              <Text type="SmallMedium">Set Password</Text>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div
              className={flex({
                direction: "column",
                align: "start",
                width: "full",
                gap: "medium",
              })}
            >
              <Text type="SmallMedium">Confirm Password</Text>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
            <Policy checked={checked} setChecked={setChecked} />
            <ActionButton type="submit" css={{ width: "100%" }}>
              Submit
            </ActionButton>
          </form>
          <div className={flex({ width: "full", justify: "center" })}>
            <Text type="SmallLight">
              Already have an account?{" "}
              <span
                style={{
                  color: theme.colors.cta.value,
                  textDecoration: "underline",
                }}
              >
                <Link href="/auth/signin/user">Sign In</Link>
              </span>
            </Text>
          </div>
        </Modal>
      </Page>
    </>
  );
};

UserSignup.removeNav = true;

export default UserSignup;
