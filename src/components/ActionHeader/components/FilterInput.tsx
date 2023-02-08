import { styled, theme } from "stitches.config";
import { Divider, Flex, NumberInput, Switch } from "@mantine/core";
import Text from "~/components/UI/Text";
import { ActionButton, Button } from "~/components/UI/Buttons";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useAppDispatch } from "~/store";
import { deactivateFilter, setFilter } from "~/store/filter";

const FilterWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapReguler",
});

interface Props {
  data: {
    title: string;
    description: string;
    placeholder: string;
    defaultValue: number;
    key: string;
    active: boolean;
    greater: boolean;
  };
}

const FilterInput = ({ data }: Props) => {
  const [checked, setChecked] = useState(data.greater);
  const [value, setValue] = useState(data.defaultValue);
  const dispatch = useAppDispatch();

  const applyFilterHandler = () => {
    console.log("Apply Filter");

    dispatch(
      setFilter({
        key: data.key,
        data: {
          active: true,
          greater: checked,
          defaultValue: value,
        },
        group: "stocks",
      })
    );
  };

  const deactivateFilterHandler = () => {
    console.log("Deactivate Filter");
    dispatch(
      deactivateFilter({
        key: data.key,
        group: "stocks",
      })
    );
  };

  return (
    <>
      <FilterWrapper>
        <Flex align="flex-start" justify="space-between">
          <Flex
            align="flex-start"
            justify="flex-start"
            direction="column"
            gap={theme.space.gapReguler.value}
          >
            <Text type="MediumSemibold">{data.title}</Text>
            <Text type="SmallRegular">{data.description}</Text>
          </Flex>
          <Switch
            label="Greater"
            labelPosition="left"
            defaultChecked={data.greater}
            checked={checked}
            onChange={() => setChecked((prev) => !prev)}
            styles={() => ({
              label: {
                fontFamily: "Poppins",
                fontSize: "12px",
                color: theme.colors.content.value,
              },
            })}
          />
        </Flex>
        <Flex justify="space-between">
          <NumberInput
            defaultValue={data.defaultValue}
            placeholder={data.placeholder}
            value={value}
            onChange={(value) => {
              if (value === undefined) return;
              setValue(value);
            }}
            size="md"
            styles={() => ({
              input: {
                fontFamily: "Poppins",
                width: "100%",
              },
              root: {
                width: "65%",
                fontFamily: "Poppins",
              },
            })}
          />
          <ActionButton
            size="small"
            status="active"
            onClick={applyFilterHandler}
          >
            Apply Filter
          </ActionButton>
          {data.active && (
            <Button size="small" onClick={deactivateFilterHandler}>
              <IoMdClose fontSize={18} color={theme.colors.content.value} />
            </Button>
          )}
        </Flex>
      </FilterWrapper>
      <Divider variant="dotted" />
    </>
  );
};

export default FilterInput;
