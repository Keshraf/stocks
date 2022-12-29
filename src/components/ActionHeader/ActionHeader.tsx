import { useState } from "react";
import { styled } from "../../../stitches.config";
import Datepicker from "../DatePicker";
import SearchBar from "../SearchBar";
import { Button } from "../UI/Buttons";
import { BiFilter } from "react-icons/bi";
import { AiOutlinePlus } from "react-icons/ai";
import { theme } from "../../../stitches.config";

const Container = styled("div", {
  width: "100%",
  height: "50px",
  start: true,
  gap: "$gapMedium",
});

const DateContainer = styled("div", {
  width: "250px",
  height: "50px",
  minWidth: "156px",
});

const ActionHeader = () => {
  const [query, setQuery] = useState<string>("");
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Container>
      <DateContainer>
        <Datepicker date={date} setDate={setDate} />
      </DateContainer>

      <SearchBar query={query} setQuery={setQuery} />
      <Button>
        <p>Filter</p>
        <BiFilter fontSize={18} color={theme.colors.content.value} />
      </Button>
      <Button>
        <p>Order</p>
        <AiOutlinePlus fontSize={18} color={theme.colors.content.value} />
      </Button>
    </Container>
  );
};

export default ActionHeader;
