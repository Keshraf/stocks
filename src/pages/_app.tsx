import "../styles/globals.css";
import type { AppType } from "next/app";
import { trpc } from "../utils/trpc";
import { Poppins } from "@next/font/google";
import Layout from "../components/Layout";
import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const App: AppType = ({ Component, pageProps }) => {
  return (
    <main className={poppins.className}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </main>
  );
};

export default trpc.withTRPC(App);
