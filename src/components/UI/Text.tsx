import { ReactNode } from "react";
import { styled } from "../../../stitches.config";

export const DefaultText = styled("p", {
  fontFamily: "$Poppins",
  color: "$content",
  display: "block",
  gap: "2px",
  variants: {
    size: {
      small: { fontSize: "12px", lineHeight: "14px" },
      medium: { fontSize: "14px", lineHeight: "16px" },
      large: { fontSize: "18px", lineHeight: "20px" },
      extralarge: { fontSize: "24px", lineHeight: "28px" },
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
  color?: string;
  width?: string;
  type?: Names;
  children: ReactNode;
  textAlign?: "left" | "center" | "right";
  justifyContent?: "flex-start" | "center" | "flex-end";
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

const Text = ({
  type = "ExtralargeBold",
  children,
  width,
  textAlign = "left",
  color = "$content",
  justifyContent = "flex-start",
}: Props) => {
  let index = names.indexOf(type);

  return (
    <DefaultText
      css={{
        width: width,
        color: color,
        textAlign: textAlign,
        justifyContent: justifyContent,
      }}
      {...config[index]}
    >
      {children}
    </DefaultText>
  );
};

export default Text;
