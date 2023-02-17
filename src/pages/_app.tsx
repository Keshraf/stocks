import "../styles/globals.css";
import type { AppProps, AppType } from "next/app";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { Poppins } from "@next/font/google";
import Layout from "../components/Layout";
import "../styles/globals.css";
import { ReactElement, ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";
import store from "~/store";
import { Toaster } from "react-hot-toast";
import { theme } from "stitches.config";

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
    <>
      <ReduxProvider store={store}>
        <main className={poppins.className}>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 1000,
              style: {
                background: theme.colors.white.value,
                color: theme.colors.content.value,
              },
            }}
          />
          {removeNav ? (
            getLayout(<Component {...pageProps} />)
          ) : (
            <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
          )}
        </main>
      </ReduxProvider>
    </>
  );
}

export default trpc.withTRPC(MyApp);
