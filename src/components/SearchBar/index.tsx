import { useState } from "react";
import { styled } from "../../../stitches.config";
import { BiSearch } from "react-icons/bi";
import { Dispatch, SetStateAction } from "react";

const Container = styled("div", {
  width: "stretch",
  height: "50px",
  start: true,
  gap: "$gapMedium",
});

const Bar = styled("input", {
  width: "stretch",
  height: "100%",
  padding: "10px 20px",
  backgroundColor: "$white",
  borderRadius: "$roundMedium",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  border: "1px solid $highlight",
  color: "$content",
  fontFamily: "$Poppins",
  "&:focus": {
    outline: "1px solid $cta",
  },
});

const IconContainer = styled("button", {
  width: "50px",
  minWidth: "50px",
  height: "100%",
  display: "flex",
  center: true,
  background: "$white",
  borderRadius: "$roundMedium",
  border: "1px solid $highlight",
  cursor: "pointer",
});

const SearchBar = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
}) => {
  return (
    <Container>
      <Bar
        value={query}
        id="search"
        type="text"
        placeholder="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <IconContainer>
        <BiSearch fontSize={20} color={"#000"} />
      </IconContainer>
    </Container>
  );
};

export default SearchBar;
