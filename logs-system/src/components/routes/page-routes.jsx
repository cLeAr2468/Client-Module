import { Routes, Route } from "react-router-dom";
import Login from "@/components/pages/login";
import AnnouncementPage from "@/components/pages/announcment";
import Register from "@/components/pages/register";
import Dashboard from "@/components/pages/dashboard";
import Appointment from "@/components/pages/appointment";
import HistoryTransactions from "@/components/pages/transact-history";
import ProfileDisplay from "@/components/pages/profile-info";
import Feedback from "@/components/pages/feedback";
import ProtectedRoute from "./ProtectedRoute";

function Reroutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AnnouncementPage />} />
      <Route path="/Announcement" element={<AnnouncementPage />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/Appointments" element={<ProtectedRoute><Appointment /></ProtectedRoute>} />
      <Route path="/Transactions" element={<ProtectedRoute><HistoryTransactions /></ProtectedRoute>} />
      <Route path="/Profile" element={<ProtectedRoute><ProfileDisplay /></ProtectedRoute>} />
      <Route path="/Feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
    </Routes>
  );
}

export default Reroutes;