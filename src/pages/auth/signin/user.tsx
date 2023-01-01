import { styled, theme } from "stitches.config";
import Text from "~/components/UI/Text";
import { flex } from "~/components/UI/Flex";
import { Input } from "~/components/UI/Input";
import { ActionButton } from "~/components/UI/Buttons";
import { FormEvent, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { Badge } from "@mantine/core";
import Logo from "~/components/Logo";
import Head from "next/head";
import { SigninUserSchema, type SigninUser } from "~/types/user";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";

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

const UserSignin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const signinUser = trpc.auth.signinUser.useMutation();
  console.log(signinUser);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const data: SigninUser = {
      email,
      password,
    };
    const result = SigninUserSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
    } else {
      const toastId = toast.loading("Signing in...", {
        duration: 10000,
      });
      console.log(data);
      const SigninPromise = await signinUser
        .mutateAsync(data)
        .then((response) => {
          toast.success("Succesfully signed In", {
            id: toastId,
          });
          console.log(response);
          router.push("/stocks");
        })
        .catch((err) => {
          if (signinUser.error && signinUser.error.message) {
            toast.error(signinUser.error.message, {
              id: toastId,
            });
          } else {
            toast.error("Unable to Sign In", {
              id: toastId,
            });
          }
        });
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
          duration: 1000,
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
              <Text type="LargeBold">Sign In</Text>
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

UserSignin.removeNav = true;

export default UserSignin;
