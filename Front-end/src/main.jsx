import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { mode } from "@chakra-ui/theme-tools";
import { ColorModeScript } from "@chakra-ui/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/socketContext";

const styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("#gray.100", "#101010")(props),
    },
  }),
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  gray: {
    light: "#faf9f2",
    dark: "#1e1e1e",
  },
};

const theme = extendTheme({ config, styles, colors });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraProvider>
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);