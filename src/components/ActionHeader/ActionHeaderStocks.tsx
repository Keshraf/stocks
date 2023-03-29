import { useEffect, useState } from "react";
import { styled } from "../../../stitches.config";
import Datepicker from "../DatePicker";
import SearchBar from "../SearchBar";
import { Button } from "../UI/Buttons";
import { AiOutlinePlus } from "react-icons/ai";
import { CgFileAdd } from "react-icons/cg";
import { theme } from "../../../stitches.config";
import Text from "../UI/Text";
import Link from "next/link";
import Filter from "./Filter";
import { useAppDispatch, useAppSelector } from "~/store";
import { setSearch } from "~/store/search";

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
  const search = useAppSelector((state) => state.search);
  const [query, setQuery] = useState<string>(search);
  const [date, setDate] = useState<Date | null>(new Date());
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("query", query);
    dispatch(setSearch(query));
  }, [query, dispatch]);

  return (
    <Container>
      <DateContainer>
        <Datepicker date={date} setDate={setDate} />
      </DateContainer>
      <SearchBar query={query} setQuery={setQuery} />
      <Filter />
      <Button as={Link} href="/stocks/new">
        <Text type="MediumSemibold">Add</Text>
        <Text type="MediumSemibold">New</Text>
        <Text type="MediumSemibold">Stock</Text>
        <CgFileAdd fontSize={18} color={theme.colors.content.value} />
      </Button>
      {/* <Button as={Link} href="/orders/new">
        <Text type="MediumSemibold">Place</Text>
        <Text type="MediumSemibold">Order</Text>
        <AiOutlinePlus fontSize={18} color={theme.colors.content.value} />
      </Button> */}
    </Container>
  );
};

export default ActionHeader;
