import { Drawer, Indicator } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiFilter } from "react-icons/bi";
import { styled, theme } from "stitches.config";
import { useAppDispatch, useAppSelector } from "~/store";
import { removeAllFilters } from "~/store/filter";
import { Button } from "../UI/Buttons";
import Text from "../UI/Text";
import FilterInput from "./components/FilterInput";

const Wrapper = styled("div", {
  width: "1getAppliedFilter0%",
  height: "stretch",
  display: "flex",
  flexDirection: "column",
  gap: "$gapLarge",
  maxHeight: "88vh",
  overflow: "auto",
});

const FilterWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapReguler",
});

export default function Filter2() {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const filter = useAppSelector((state) => state.filter);
  const [filterOptions, setFilterOptions] = useState<any>([]);
  const [location, setLocation] = useState<"stocks">();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(router.pathname.split("/")[1]);

    if (router.pathname.split("/")[1] === "stocks") {
      setLocation("stocks");
      setFilterOptions(filter.stocks);
    }
  }, [router.pathname, filter]);

  const getAppliedFilter = () => {
    let count = 0;

    console.log(filterOptions);
    filterOptions.forEach((data: any) => {
      if (data.active) {
        count++;
      }
    });

    return count.toString();
  };

  const removeFilterHanlder = () => {
    dispatch(
      removeAllFilters({
        group: location,
      })
    );
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        padding="xl"
        size="xl"
        position="right"
        lockScroll={false}
      >
        <Wrapper>
          <Text type="ExtralargeBold">Filter</Text>
          {filterOptions.map((data: any, index: number) => {
            return <FilterInput data={data} key={index} />;
          })}
          <Button size={"full"} onClick={removeFilterHanlder}>
            Remove All Filters
          </Button>
        </Wrapper>
      </Drawer>

      <Indicator size={18} label={getAppliedFilter()} inline showZero={false}>
        <Button onClick={() => setOpened(true)}>
          <Text type="MediumSemibold">Filter</Text>
          <BiFilter fontSize={18} color={theme.colors.content.value} />
        </Button>
      </Indicator>
    </>
  );
}
