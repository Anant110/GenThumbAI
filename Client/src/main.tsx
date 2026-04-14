import { createRoot } from "react-dom/client";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/context.js";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  {/* It means auth provider is giving the global access to authentication info like user, login, logout, token */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
);
