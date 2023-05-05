import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { styled, theme } from "../../../../stitches.config";
import { AiOutlineUser } from "react-icons/ai";
import Text from "../../UI/Text";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAppDispatch } from "~/store";
import { setSearch } from "~/store/search";
import { Button, Menu, Switch } from "@mantine/core";
import { HiLogout } from "react-icons/hi";
import { TbMail, TbMailOff } from "react-icons/tb";
import { useLocalStorage } from "@mantine/hooks";

const Container = styled("nav", {
  width: "100%",
  height: "auto",
  padding: "15px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  background: "$white",
  borderRadius: "$roundLarge",
});

const NavLinks = styled("ul", {
  width: "fit-content",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
  backgroundColor: "$white",
});

const NavLink = styled(Link, {
  width: "fit-content",
  height: "auto",
  padding: "10px 15px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "$roundSmall",
  variants: {
    variant: {
      active: {
        backgroundColor: "$highlight",
      },
    },
  },
});

const IconContainer = styled("div", {
  size: "40px",
  display: "flex",
  center: true,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "$highlight",
    borderRadius: "$roundSmall",
  },
});

type NavText =
  | "Stocks"
  | "Orders"
  | "Clients"
  | "Upload"
  | "Analytics"
  | "Mill Orders";
type NavArr = {
  link: string;
  text: NavText;
};

const Navigation = () => {
  const [message, setMessage] = useLocalStorage({
    key: "message",
    defaultValue: "false",
  });

  const [activeNav, setActiveNav] = useState<NavText>("Stocks");
  const router = useRouter();

  const navLinks: NavArr[] = useMemo(
    () => [
      {
        text: "Stocks",
        link: "/stocks",
      },
      {
        text: "Orders",
        link: "/orders",
      },
      {
        text: "Clients",
        link: "/clients",
      },
      {
        text: "Mill Orders",
        link: "/mills",
      },
      {
        text: "Upload",
        link: "/upload",
      },
      {
        text: "Analytics",
        link: "/analytics",
      },
    ],
    []
  );

  useEffect(() => {
    const path = router.pathname;
    navLinks.forEach((nav) => {
      if (path.includes(nav.link)) {
        setActiveNav(nav.text);
      }
    });
  }, [router.pathname, navLinks]);

  const clearCookie = () => {
    document.cookie =
      "STOCKS_ACCESS_TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/");
  };

  return (
    <>
      <Head>
        <title>{activeNav}</title>
      </Head>
      <Container>
        <NavLinks>
          {navLinks.map((value) => {
            if (activeNav === value.text) {
              return (
                <NavLink variant="active" key={value.text} href={value.link}>
                  <Text type="MediumSemibold">{value.text}</Text>
                </NavLink>
              );
            }
            return (
              <NavLink
                key={value.text}
                href={value.link}
                onClick={() => setActiveNav(value.text)}
              >
                <Text type="MediumSemibold">{value.text}</Text>
              </NavLink>
            );
          })}
        </NavLinks>
        <NavLinks>
          <Switch
            checked={message === "true"}
            onChange={(e) => {
              const value = e.currentTarget.checked ? "true" : "false";
              setMessage(value);
            }}
            size="md"
            onLabel={<TbMail size="1rem" />}
            offLabel={<TbMailOff size="1rem" />}
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <IconContainer>
                <AiOutlineUser
                  fontSize={24}
                  color={theme.colors.content.value}
                />
              </IconContainer>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => clearCookie()}
                icon={<HiLogout size={14} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </NavLinks>
      </Container>
    </>
  );
};

export default Navigation;
