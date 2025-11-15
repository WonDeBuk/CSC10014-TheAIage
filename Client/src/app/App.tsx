import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  return (
    <div style={{ fontSize: "24px" }}>
      <RouterProvider router={router} />
    </div>
  );
}