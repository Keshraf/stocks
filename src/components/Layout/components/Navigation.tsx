import Link from "next/link";
import { useState } from "react";
import { styled } from "../../../../stitches.config";
import { AiOutlineUser } from "react-icons/ai";
import Text from "../../UI/Text";

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
});

type NavText = "Stocks" | "Orders" | "Clients" | "Upload" | "Analytics";
type NavArr = {
  link: string;
  text: NavText;
};

const Navigation = () => {
  const [activeNav, setActiveNav] = useState<NavText>("Stocks");
  const navLinks: NavArr[] = [
    {
      text: "Stocks",
      link: "/",
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
      text: "Upload",
      link: "/upload",
    },
    {
      text: "Analytics",
      link: "/analytics",
    },
  ];

  return (
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
      <IconContainer>
        <AiOutlineUser fontSize={24} color={"#000"} />
      </IconContainer>
    </Container>
  );
};

export default Navigation;