import { styled } from "stitches.config";

export const Input = styled("input", {
  width: "100%",
  height: "40px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  border: "2px solid $highlight",
  borderRadius: "$roundMedium",
  paddingLeft: "$gapMedium",
  fontFamily: "$Poppins",
  color: "$content",
  fontSize: "$medium",
  fontWeight: "$medium",
  backgroundColor: "$white",
});
