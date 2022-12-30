import Image from "next/image";
import Link from "next/link";
import { styled } from "stitches.config";

const ImageContainer = styled(Link, {
  width: "fit-content",
  height: "fit-content",
  position: "absolute",
  top: "25px",
  left: "25px",
});

const Logo = () => {
  return (
    <ImageContainer href="/">
      <Image src="/Logo.svg" alt="Logo" width={36} height={36} />
    </ImageContainer>
  );
};

export default Logo;
