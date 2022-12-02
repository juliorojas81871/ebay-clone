import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import network from "../utils/network";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={network}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Component {...pageProps} />
        <Toaster position="top-center" reverseOrder={false} />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
