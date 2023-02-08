import { createStitches } from "@stitches/react";

export const { styled, css, getCssText, theme } = createStitches({
  theme: {
    colors: {
      white: "#FFFFFF",
      background: "#F8FBFC",
      highlight: "#F4F8F9",
      cta: "#4794F4",
      ctaLight: "#B8D9FC",
      content: "#494A4B",
    },
    fontSizes: {
      h1: "18px",
      h2: "16px",
      large: "14px",
      medium: "12px",
      small: "10px",
    },
    radii: {
      roundLarge: "14px",
      roundMedium: "8px",
      roundSmall: "6px",
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    space: {
      gapSmall: "5px",
      gapReguler: "8px",
      gapMedium: "12px",
      gapLarge: "15px",
      gapXLarge: "18px",
    },

    fonts: {
      Poppins: "Poppins",
    },
  },
  utils: {
    // Abbreviated margin properties
    m: (value: string): { margin: string } => ({
      margin: value,
    }),
    mx: (value: string): { marginLeft: string; marginRight: string } => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: string): { marginTop: string; marginBottom: string } => ({
      marginTop: value,
      marginBottom: value,
    }),

    // A property for applying width/height together
    size: (value: string): { width: string; height: string } => ({
      width: value,
      height: value,
    }),

    // An abbreviated property for border-radius
    br: (value: string): { borderRadius: string } => ({
      borderRadius: value,
    }),

    center: (
      value: boolean
    ): {
      display: string;
      flexDirection: string;
      justifyContent: string;
      alignItems: string;
    } => ({
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }),

    start: (
      value: boolean
    ): {
      display: string;
      flexDirection: string;
      justifyContent: string;
      alignItems: string;
    } => ({
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    }),

    column: (
      value: boolean
    ): {
      display: string;
      flexDirection: string;
      justifyContent: string;
      alignItems: string;
    } => ({
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }),
  },
});
