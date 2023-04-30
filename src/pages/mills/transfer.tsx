import { styled } from "stitches.config";
import StockChange from "~/components/ChangeGroup/StockChange";
import Text from "~/components/UI/Text";
import { useAppDispatch, useAppSelector } from "~/store";
import { Button as MantineButton } from "@mantine/core";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { resetSelectedSpecs } from "~/store/selectedSpecs";
import { resetSelectedStocks } from "~/store/selectedStocks";
import { StockUpdate, StockUpdateSchema } from "~/types/stocks";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { trpc } from "~/utils/trpc";

const Wrapper = styled("main", {
  width: "100%",
  height: "stretch",
  backgroundColor: "$white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  borderRadius: "$roundLarge",
  border: "1px solid $highlight",
  padding: "20px",
  gap: "$gapXLarge",
  variants: {
    direction: {
      center: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

const DividerWrapper = styled("div", {
  width: "100%",
  height: "2px",
  backgroundColor: "$highlight",
});

const InfoWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "$gapMedium",
  overflowX: "auto",
  overflowY: "hidden",
});

const InfoRow = styled("div", {
  width: "auto",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "$gapMedium",
});

const MillTransferPage = () => {
  const selectedStocks = useAppSelector((state) => state.selectedStocks);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutateAsync: updateStocks } =
    trpc.stocks.updateStocksQuantity.useMutation();

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(resetSelectedStocks());
      dispatch(resetSelectedSpecs());
    };

    router.events.on("routeChangeStart", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events, dispatch]);

  const headers = [
    {
      title: "Mill",
      width: "30px",
    },
    {
      title: "Quality",
      width: "70px",
    },
    {
      title: "Size",
      width: "70px",
    },
    {
      title: "Weight",
      width: "50px",
    },
    {
      title: "GSM",
      width: "50px",
    },
    {
      title: "Sheets",
      width: "50px",
    },
    {
      title: "Order No.",
      width: "150px",
    },
    /* {
      title: "Client",
      width: "150px",
    }, */
    {
      title: "Remaining",
      width: "100px",
    },

    {
      title: "Godown",
      width: "100px",
    },
    {
      title: "Transit",
      width: "100px",
    },
    {
      title: "Ordered",
      width: "100px",
    },
  ];

  const submitHandler = () => {
    if (selectedStocks.length === 0) return;

    let pass = true;

    const updatedStocks: StockUpdate[] = selectedStocks.map((stock) => {
      if (
        stock.quantity + stock.transit + stock.ordered !==
        stock.changedQuantity + stock.changedTransit + stock.changedOrdered
      ) {
        toast.error(
          "Quantity, Transit and Ordered must add up to the total quantity"
        );
        pass = false;
      }

      return {
        id: stock.id,
        quantity: stock.changedQuantity,
        transit: stock.changedTransit,
        ordered: stock.changedOrdered,
      };
    });

    if (!pass) return;

    const result = z.array(StockUpdateSchema).safeParse(updatedStocks);

    if (!result.success) {
      console.log(result);
      result.error.errors.map((e) =>
        toast.error(e.message, {
          position: "top-right",
        })
      );
    } else {
      console.log(result.data);

      const UpdateStockPromise = updateStocks(result.data);

      toast.promise(UpdateStockPromise, {
        loading: "Updating Stocks...",
        success: "Stocks Updated",
        error: "Error Updating Stocks",
      });

      UpdateStockPromise.then(() => {
        dispatch(resetSelectedStocks());
        dispatch(resetSelectedSpecs());
        router.push("/mills");
      }).catch(() => {
        console.log("Error");
      });
    }
  };

  return (
    <Wrapper>
      <Text>Stock Transfer Page</Text>
      <InfoWrapper>
        {headers.map((header, index) => {
          return (
            <InfoRow css={{ width: header.width }} key={index}>
              <Text type="SmallMedium">{header.title}</Text>
            </InfoRow>
          );
        })}
      </InfoWrapper>
      {selectedStocks.map((stock) => {
        return <StockChange key={stock.id} stock={stock} />;
      })}
      <DividerWrapper />
      <MantineButton onClick={submitHandler}>Submit</MantineButton>
    </Wrapper>
  );
};

export default MillTransferPage;
