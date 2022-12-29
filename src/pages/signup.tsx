import { styled, theme } from "stitches.config";
import Text from "~/components/UI/Text";
import { flex } from "~/components/UI/Flex";
import { Input } from "~/components/UI/Input";
import { ActionButton } from "~/components/UI/Buttons";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";

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

const UserSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(3, { message: "Name must contain atleast 3 letters" })
      .max(10, { message: "Name can contain atmost 10 letters" })
      .trim(),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid Email Address" })
      .trim(),
    password: z
      .string()
      .min(5, { message: "Password must contain atleast 5 letters" })
      .trim(),
    confirm: z.string().trim(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match!",
  });

type User = z.infer<typeof UserSchema>;

const Signup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const data: User = {
      name,
      email,
      password,
      confirm,
    };
    const result = UserSchema.safeParse(data);
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
        <Modal>
          <div className={flex({ width: "full", justify: "center" })}>
            <Text type="LargeBold">Sign Up </Text>
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
                <Link href="/signin">Sign In</Link>
              </span>
            </Text>
          </div>
        </Modal>
      </Page>
    </>
  );
};

Signup.isAuth = true;

export default Signup;
