import { ChThemeProvider } from "@custhome/ui";
import "@custhome/ui/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChThemeProvider>
  </StrictMode>
);
