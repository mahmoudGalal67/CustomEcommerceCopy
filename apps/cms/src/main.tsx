import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CMSProvider } from "./cms/store.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import AuthBootstrap from "./components/AuthBootstrap.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <CMSProvider>
        <BrowserRouter>
          <AuthBootstrap />
          <App />
        </BrowserRouter>
      </CMSProvider>
    </Provider>
  </StrictMode>
);
