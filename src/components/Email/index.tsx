import * as React from "react";
import { Html } from "@react-email/html";
import { Button } from "@react-email/button";
import { styled } from "stitches.config";

type Props = {
  url: string;
};

const HTML = styled(Html, {});

export function Email(props: Props) {
  const { url } = props;

  return (
    <Html
      style={{
        width: "100%",
        backgroundColor: "#121212",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "$gapLarge",
        minHeight: "300px",
      }}
      lang="en"
    >
      <Button
        style={{
          width: "200px",
          height: "50px",
          backgroundColor: "#3b3ece",
          color: "#fff",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          textAlign: "center",
          verticalAlign: "middle",
        }}
        href={url}
      >
        Click me
      </Button>
    </Html>
  );
}
