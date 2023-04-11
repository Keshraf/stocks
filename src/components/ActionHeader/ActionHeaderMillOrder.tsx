import { useEffect, useState } from "react";
import { styled } from "../../../stitches.config";
import Datepicker from "../DatePicker";
import SearchBar from "../SearchBar";
import { Button } from "../UI/Buttons";
import { FiPackage } from "react-icons/fi";
import { CgFileAdd } from "react-icons/cg";
import { theme } from "../../../stitches.config";
import Text from "../UI/Text";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "~/store";
import { setSearch } from "~/store/search";
import { useRouter } from "next/router";

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

  const router = useRouter();

  useEffect(() => {
    console.log("query", query);
    dispatch(setSearch(query));
  }, [query, dispatch]);

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(setSearch(""));
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [dispatch, router.events]);

  return (
    <Container>
      <DateContainer>
        <Datepicker date={date} setDate={setDate} />
      </DateContainer>
      <SearchBar query={query} setQuery={setQuery} />
      {/* <Button as={Link} href="/mills/transfer">
        <Text type="MediumSemibold">Transfer</Text>
        <Text type="MediumSemibold">Goods</Text>
        <FiPackage fontSize={18} color={theme.colors.content.value} />
      </Button> */}
    </Container>
  );
};

export default ActionHeader;
