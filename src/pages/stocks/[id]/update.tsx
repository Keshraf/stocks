import { Button, Loader, NumberInput } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { styled } from "stitches.config";
import { z } from "zod";
import Text from "~/components/UI/Text";
import { trpc } from "~/utils/trpc";

const UpdateStockSchema = z.object({
  id: z.string(),
  breadth: z.number(),
  length: z.number(),
  weight: z.number(),
  sheets: z.number(),
  gsm: z.number(),
});

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

const InputWrapper = styled("div", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const Form = styled("form", {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "$gapMedium",
});

const UpdateById = () => {
  const router = useRouter();
  const { id } = router.query;

  const [breadth, setBreadth] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [gsm, setGsm] = useState<number>(0);
  const [sheets, setSheets] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  if (!router.isReady) {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  if (!id) return null;
  if (typeof id !== "string") {
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );
  }

  if (typeof id !== "string") {
    return <Text>Invalid ID</Text>;
  }
  const { data, isLoading } = trpc.stocks.getSpecById.useQuery(id);
  const { mutateAsync: updateSpecsById } =
    trpc.stocks.updateSpecsById.useMutation();

  if (isLoading || !data)
    return (
      <Wrapper direction="center">
        <Loader />
      </Wrapper>
    );

  const NumberInputs = [
    {
      variable: breadth,
      setVariable: setBreadth,
      label: "Breadth",
      placeholder: "Enter Breadth",
      precision: 2,
      default: data.breadth,
    },
    {
      variable: length,
      setVariable: setLength,
      label: "Length",
      placeholder: "Enter Length",
      precision: 2,
      default: data.length,
    },
    {
      variable: weight,
      setVariable: setWeight,
      label: "Weight",
      placeholder: "Enter Weight",
      precision: 2,
      default: data.weight,
    },
    {
      variable: gsm,
      setVariable: setGsm,
      label: "GSM",
      placeholder: "Enter GSM",
      precision: 0,
      default: data.gsm,
    },
    {
      variable: sheets,
      setVariable: setSheets,
      label: "Sheets",
      placeholder: "Enter Sheets",
      precision: 0,
      default: data.sheets,
    },
  ];

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const [breadth, length, weight, gsm, sheets] = Object.values(e.target)
      .filter((el) => el.tagName === "INPUT")
      .map((el) => el.value);

    const data = {
      id,
      breadth: Number(breadth),
      length: Number(length),
      weight: Number(weight),
      gsm: Number(gsm),
      sheets: Number(sheets),
    };

    const result = UpdateStockSchema.safeParse(data);

    if (!result.success) {
      toast.error(result.error.message);
    } else {
      console.log(result.data);
      const UpdatePromise = updateSpecsById(result.data);

      toast.promise(UpdatePromise, {
        loading: "Updating Stock...",
        success: "Stock Updated",
        error: "Error Updating Stock",
      });

      await UpdatePromise;
      router.push(`/stocks/${id}`);
    }
  };

  return (
    <Wrapper>
      <Text>Update Stock</Text>
      <Text type="MediumRegular">Mill: {data.quality.millName}</Text>
      <Text type="MediumRegular">Quality: {data.qualityName}</Text>
      <Form onSubmit={formSubmitHandler}>
        {NumberInputs.map((input) => {
          return (
            <InputWrapper key={input.label}>
              <NumberInput
                label={input.label}
                defaultValue={input.default}
                placeholder={input.placeholder}
                step={0.5}
                precision={input.precision}
              />
            </InputWrapper>
          );
        })}
        <Button color={"blue"} type="submit">
          <p style={{ color: "#fff" }}>Submit</p>
        </Button>
      </Form>
    </Wrapper>
  );
};

export default UpdateById;
