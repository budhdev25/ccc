import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext";
import { LayoutProvider } from "./context/LayoutContext";
import { SessionProvider } from "./context/SessionContext";
import { TavusProvider } from "./context/TavusContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LayoutProvider>
        <SessionProvider>
          <TavusProvider>
            <App />
          </TavusProvider>
        </SessionProvider>
      </LayoutProvider>
    </ThemeProvider>
  </StrictMode>
);
