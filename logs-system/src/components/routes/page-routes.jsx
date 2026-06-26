import { Routes, Route } from "react-router-dom";
import Login from "@/components/pages/login";
import AnnouncementPage from "@/components/pages/announcment";
import Register from "@/components/pages/register";
function Reroutes() {
  return (
    <Routes>
      <Route path="/" element={<AnnouncementPage />} />
      <Route path="/Announcement" element={<AnnouncementPage />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default Reroutes;