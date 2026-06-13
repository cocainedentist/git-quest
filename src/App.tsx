import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import ProfileSettings from "./pages/ProfileSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  );
}
