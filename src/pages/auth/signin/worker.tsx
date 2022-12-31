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
import Logo from "~/components/Logo";
import Head from "next/head";

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

const WorkerSchema = z.object({
  username: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email({ message: "Invalid Email Address" })
    .trim(),
  company: z
    .string({
      required_error: "Company is required",
      invalid_type_error: "Company must be a string",
    })
    .min(3, { message: "Name must contain atleast 3 letters" })
    .trim(),
  password: z
    .string()
    .min(5, { message: "Password must contain atleast 5 letters" })
    .trim(),
});

type Worker = z.infer<typeof WorkerSchema>;

const Worker = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [company, setCompany] = useState<string>("");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const data: Worker = {
      username,
      company,
      password,
    };
    const result = WorkerSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
    } else {
      console.log(data);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In - Balaji Khata</title>
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
      <Logo />
      <Page>
        <Modal>
          <div className={flex({ width: "full", justify: "center" })}>
            <div className={flex({ gap: "small" })}>
              <Text type="LargeBold">Sign In</Text>
              <Badge size="lg" radius="md">
                Team
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
              <Text type="SmallMedium">Username</Text>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
              <Text type="SmallMedium">Company</Text>
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

            <ActionButton type="submit" css={{ width: "100%" }}>
              Submit
            </ActionButton>
          </form>
          <div className={flex({ width: "full", justify: "center" })}>
            <Text type="SmallLight">
              {"Don't have an account?"}{" "}
              <span
                style={{
                  color: theme.colors.cta.value,
                  textDecoration: "underline",
                }}
              >
                <Link href="/auth/signup/user">Sign up</Link>
              </span>
            </Text>
          </div>
        </Modal>
      </Page>
    </>
  );
};

Worker.removeNav = true;

export default Worker;
