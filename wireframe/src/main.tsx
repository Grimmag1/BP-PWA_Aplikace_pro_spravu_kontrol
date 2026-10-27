import { HashRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <Theme appearance="light" accentColor="violet" radius="medium">
      <App />
    </Theme>
  </HashRouter>,
);
