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
    </Container>
  );
};

export default ActionHeader;
