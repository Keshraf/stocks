import { useEffect, useState } from "react";
import { styled } from "../../../stitches.config";
import Datepicker from "../DatePicker";
import SearchBar from "../SearchBar";
import { FiPackage } from "react-icons/fi";
import { CgFileAdd } from "react-icons/cg";
import { theme } from "../../../stitches.config";
import Text from "../UI/Text";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "~/store";
import { setSearch } from "~/store/search";
import { useRouter } from "next/router";
import { Button, Modal, TextInput } from "@mantine/core";
import { trpc } from "~/utils/trpc";
import { toast } from "react-hot-toast";
import { resetSelectedStocks } from "~/store/selectedStocks";
import { useLocalStorage, useSessionStorage } from "@mantine/hooks";
import { TbTrash } from "react-icons/tb";

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

const Form = styled("form", {
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const ActionHeader = () => {
  const [refetch, setRefetch] = useSessionStorage({
    key: "refetchStocks",
    defaultValue: "false",
  });
  const selectedStocks = useAppSelector((state) => state.selectedStocks);
  const search = useAppSelector((state) => state.search);
  const [query, setQuery] = useState<string>(search);
  const [date, setDate] = useState<Date | null>(new Date());
  const [opened, setOpened] = useState(false);
  const [orderNo, setOrderNo] = useState<string>("");
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { mutateAsync: updateSalesOrderNo } =
    trpc.stocks.updateStockSalesOrderNo.useMutation();

  const { mutateAsync: deleteStocks } = trpc.stocks.deleteStocks.useMutation();

  useEffect(() => {
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

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const ids = selectedStocks.map((stock) => stock.id);
    const UpdatePromise = updateSalesOrderNo({
      id: ids,
      salesOrderNo: orderNo,
    });
    toast.promise(UpdatePromise, {
      loading: "Updating Sales Order No.",
      success: "Sales Order No. Updated",
      error: "Error updating Sales Order No.",
    });
    await UpdatePromise;
    dispatch(resetSelectedStocks());
    setRefetch("true");
    setOpened(false);
  };

  const deleteHandler = async () => {
    const ids = selectedStocks.map((stock) => stock.id);
    const DeletePromise = deleteStocks(ids);
    toast.promise(DeletePromise, {
      loading: "Deleting Stocks",
      success: "Stocks Deleted",
      error: "Error deleting Stocks",
    });
    await DeletePromise;
    dispatch(resetSelectedStocks());
    setRefetch("true");
  };

  return (
    <Container>
      <Modal
        title="Set Sales Order No. for Selected Stocks"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <Form onSubmit={submitHandler}>
          <TextInput
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="Enter Sales order no."
          />
          <Button type="submit">Confirm</Button>
        </Form>
      </Modal>
      <DateContainer>
        <Datepicker date={date} setDate={setDate} />
      </DateContainer>
      <SearchBar query={query} setQuery={setQuery} />
      {/* <Button as={Link} href="/mills/transfer">
        <Text type="MediumSemibold">Transfer</Text>
        <Text type="MediumSemibold">Goods</Text>
        <FiPackage fontSize={18} color={theme.colors.content.value} />
      </Button> */}
      {selectedStocks.length > 0 && (
        <>
          <Button
            style={{ height: "48px" }}
            leftIcon={<TbTrash />}
            radius="md"
            color={"red"}
            variant="light"
            onClick={() => deleteHandler()}
          >
            Delete
          </Button>
          <Button
            style={{ height: "48px" }}
            radius="md"
            onClick={() => setOpened(true)}
            variant="light"
          >
            Add Sales Order No.
          </Button>
        </>
      )}
    </Container>
  );
};

export default ActionHeader;
