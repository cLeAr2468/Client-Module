import { Routes, Route } from "react-router-dom";
import Login from "@/components/pages/login";
import AnnouncementPage from "@/components/pages/announcment";
import Register from "@/components/pages/register";
import Dashboard from "@/components/pages/dashboard";
import Appointment from "@/components/pages/appointment";
import HistoryTransactions from "@/components/pages/transact-history";
import ProfileDisplay from "@/components/pages/profile-info";
import Feedback from "@/components/pages/feedback";
function Reroutes() {
  return (
    <Routes>
      <Route path="/" element={<AnnouncementPage />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/Announcement" element={<AnnouncementPage />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Appointments" element={<Appointment />} />
      <Route path="/Transactions" element={<HistoryTransactions />} />
      <Route path="/Profile" element={<ProfileDisplay />} />
      <Route path="/Feedback" element={<Feedback />} />
    </Routes>
  );
}

export default Reroutes;