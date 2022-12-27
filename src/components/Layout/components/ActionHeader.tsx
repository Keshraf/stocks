import { useState } from "react";
import { styled } from "../../../../stitches.config";
import SearchBar from "../../SearchBar";

const Container = styled("div", {
  width: "100%",
  height: "50px",
  start: true,
  gap: "$gapMedium",
});

const ActionHeader = () => {
  const [query, setQuery] = useState<string>("");

  return (
    <Container>
      <SearchBar query={query} setQuery={setQuery} />
    </Container>
  );
};

export default ActionHeader;
