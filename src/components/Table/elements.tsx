import { styled } from "../../../stitches.config";

export const TableItem = styled("td", {
  width: "100px",
  height: "auto",
  fontFamily: "Poppins",
  fontSize: "$large",
  color: "$content",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
  lineHeight: "18px",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
});

export const TableHeadItem = styled("th", {
  width: "100px",
  height: "auto",
  lineHeight: "20px",
  fontFamily: "Poppins",
  fontSize: "$large",
  color: "$content",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
  fontWeight: "$semibold",
  userSelect: "none",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  "&:hover": {
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    textDecorationThickness: "2px",
  },
});

export const TableRow = styled("tr", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignContent: "center",
  borderRadius: "$roundSmall",
  padding: "12px",
  position: "relative",
  "&:hover": {
    backgroundColor: "$highlight",
  },
});

export const TableBody = styled("tbody", {
  width: "100%",
  height: "auto",
  display: "table",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "8px",
  marginTop: "20px",
});

export const TableHead = styled("thead", {
  width: "100%",
  height: "auto",
  display: "table",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "$highlight",
  borderRadius: "$roundSmall",
  position: "sticky",
  top: 0,
  zIndex: 3,
});

export const TableWrapper = styled("table", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  maxHeight: "66vh",
  overflow: "scroll",
  position: "relative",
  paddingBottom: "60px",
});
