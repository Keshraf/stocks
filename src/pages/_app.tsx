import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Poppins } from "@next/font/google";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  removeNav?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const removeNav = Component.removeNav;
  return (
    <main className={poppins.className}>
      {removeNav ? (
        getLayout(<Component {...pageProps} />)
      ) : (
        <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
      )}
    </main>
  );
}

export default trpc.withTRPC(MyApp);
