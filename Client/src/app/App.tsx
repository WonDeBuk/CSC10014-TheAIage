import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AuthProvider } from "./providers/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <div style={{ fontSize: "24px" }}>
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}