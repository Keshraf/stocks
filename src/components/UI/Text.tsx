import { ReactNode } from "react";
import { styled } from "../../../stitches.config";

export const DefaultText = styled("p", {
  fontFamily: "$Poppins",
  color: "$content",
  display: "block",
  gap: "2px",
  variants: {
    size: {
      small: { fontSize: "12px" },
      medium: { fontSize: "14px" },
      large: { fontSize: "18px" },
      extralarge: { fontSize: "24px" },
    },
    weight: {
      light: {
        fontWeight: "$light",
      },
      regular: {
        fontWeight: "$regular",
      },
      medium: {
        fontWeight: "$medium",
      },
      semibold: {
        fontWeight: "$semibold",
      },
      bold: {
        fontWeight: "$bold",
      },
    },
  },
});

type Size = "small" | "medium" | "large" | "extralarge";
const size: Size[] = ["small", "medium", "large", "extralarge"];
type Weight = "light" | "regular" | "medium" | "semibold" | "bold";
const weight: Weight[] = ["light", "regular", "medium", "semibold", "bold"];

type Props = {
  type: Names;
  children: ReactNode;
};

const TextCombinations = size
  .map((s, index) => {
    return weight.map((w) => {
      return {
        text: `${s.charAt(0).toUpperCase()}${s.substring(1)}${w
          .charAt(0)
          .toUpperCase()}${w.substring(1)}`,
        size: s,
        weight: w,
      };
    });
  })
  .flat(1);

type Names =
  | "SmallLight"
  | "SmallRegular"
  | "SmallMedium"
  | "SmallSemibold"
  | "SmallBold"
  | "MediumLight"
  | "MediumRegular"
  | "MediumMedium"
  | "MediumSemibold"
  | "MediumBold"
  | "LargeLight"
  | "LargeRegular"
  | "LargeMedium"
  | "LargeSemibold"
  | "LargeBold"
  | "ExtralargeLight"
  | "ExtralargeRegular"
  | "ExtralargeMedium"
  | "ExtralargeSemibold"
  | "ExtralargeBold";

const names = TextCombinations.map((val) => val.text);
const config = TextCombinations.map((val) => {
  return {
    size: val.size,
    weight: val.weight,
  };
});

const Text = ({ type, children }: Props) => {
  let index = names.indexOf(type);

  return <DefaultText {...config[index]}>{children}</DefaultText>;
};

export default Text;
