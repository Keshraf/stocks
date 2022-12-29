import { styled } from "../../../stitches.config";

export const TableItem = styled("td", {
  width: "10%",
  height: "auto",
  fontFamily: "Poppins",
  fontSize: "$large",
  color: "$content",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
});

export const TableHeadItem = styled("th", {
  width: "10%",
  height: "auto",
  fontFamily: "Poppins",
  fontSize: "$large",
  color: "$content",
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textAlign: "left",
  fontWeight: "$semibold",
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
  "&:hover": {
    backgroundColor: "$highlight",
  },
});

export const TableBody = styled("tbody", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: "8px",
  marginTop: "20px",
});

export const TableHead = styled("thead", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  background: "$highlight",
  borderRadius: "$roundSmall",
  position: "sticky",
  top: 0,
});

export const TableWrapper = styled("table", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  overflowY: "auto",
  position: "relative",
  maxHeight: "66vh",
});
