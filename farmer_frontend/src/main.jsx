import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext"; // Ensure correct path
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <CartProvider> {/* ✅ Wrap App with CartProvider */}
                <App />
            </CartProvider>
        </AuthProvider>
    </StrictMode>
);
