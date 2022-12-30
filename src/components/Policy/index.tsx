import { DefaultText } from "../UI/Text";
import { flex } from "../UI/Flex";
import { theme } from "stitches.config";
import Link from "next/link";
import { Checkbox } from "@mantine/core";

import { Dispatch, SetStateAction } from "react";

type Props = {
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
};

const Policy = ({ checked, setChecked }: Props) => {
  return (
    <>
      <DefaultText css={{ fontSize: "10px", lineHeight: "15px" }}>
        By registering, you agree to the processing of your personal data by
        Balaji Khata as described in the{" "}
        <span
          style={{
            color: theme.colors.cta.value,
            textDecoration: "underline",
          }}
        >
          <Link href="https://www.freeprivacypolicy.com/live/c540de2f-99e3-493f-97d4-06a281e7fe99">
            Privacy Policy
          </Link>
        </span>
        .
      </DefaultText>
      <div
        className={flex({
          justify: "start",
          width: "full",
          gap: "medium",
        })}
      >
        <Checkbox
          size="xs"
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
        <DefaultText css={{ fontSize: "10px", lineHeight: "15px" }}>
          I&apos;ve read and agree to the{" "}
          <span
            style={{
              color: theme.colors.cta.value,
              textDecoration: "underline",
            }}
          >
            <Link href="https://docs.google.com/document/d/1ceDQZ_aI2hZr3xi9wSmwyV50nSLkCNl0n0ovVlyQrRw/edit?usp=sharing">
              Terms of Service
            </Link>
          </span>
        </DefaultText>
      </div>
    </>
  );
};

export default Policy;
