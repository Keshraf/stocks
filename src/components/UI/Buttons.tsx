import { styled } from "../../../stitches.config";

export const Button = styled("button", {
  width: "fit-content",
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
});
