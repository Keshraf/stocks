import { styled } from "../../../stitches.config";
import { Button as MantineButton } from "@mantine/core";

export const Button = styled("button", {
  width: "fit-content",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  paddingLeft: "18px",
  paddingRight: "18px",
  height: "50px",
  fontFamily: "$Poppins",
  color: "$content",
  fontSize: "$large",
  fontWeight: "$medium",
  center: true,
  gap: "$gapSmall",
  background: "$white",
  borderRadius: "$roundMedium",
  border: "1px solid $highlight",
  cursor: "pointer",
  variants: {
    size: {
      small: {
        padding: "0px 12px",
        fontSize: "$medium",
        height: "42px",
      },
      full: {
        width: "100%",
      },
      fit: {
        width: "fit-content",
        height: "100%",
      },
    },
  },

  "&:hover": {
    backgroundColor: "white",
    border: "1px solid $content",
  },
});

export const ActionButton = styled("button", {
  width: "fit-content",
  paddingLeft: "18px",
  paddingRight: "18px",
  height: "50px",
  fontFamily: "$Poppins",
  color: "$white",
  fontSize: "$large",
  fontWeight: "$medium",
  center: true,
  gap: "$gapSmall",
  background: "$cta",
  borderRadius: "$roundMedium",
  border: "1px solid $ctaLight",
  cursor: "pointer",
  variants: {
    status: {
      active: {
        backgroundColor: "$cta",
      },
      inactive: {
        backgroundColor: "$ctaLight",
      },
    },
    size: {
      small: {
        padding: "0px 12px",
        fontSize: "$medium",
        height: "42px",
      },
      fit: {
        width: "fit-content",
        height: "100%",
      },
    },
  },
});
