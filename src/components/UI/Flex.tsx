import { css, styled } from "stitches.config";

export const flex = css({
  width: "fit-content",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  variants: {
    direction: {
      row: {
        flexDirection: "row",
      },
      column: {
        flexDirection: "column",
      },
    },
    justify: {
      start: {
        justifyContent: "flex-start",
      },
      between: {
        justifyContent: "space-between",
      },
      center: {
        justifyContent: "center",
      },
    },
    align: {
      center: {
        alignItems: "center",
      },
      start: {
        alignItems: "flex-start",
      },
    },
    width: {
      full: {
        width: "100%",
      },
      fit: {
        width: "fit-content",
      },
      auto: {
        width: "auto",
      },
    },
    gap: {
      small: {
        gap: "$gapSmall",
      },
      medium: {
        gap: "$gapMedium",
      },
      large: {
        gap: "$gapLarge",
      },
      extralarge: {
        gap: "$gapXLarge",
      },
    },
  },
});
