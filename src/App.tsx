import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import StudentLayout from "./components/layouts/StudentLayout";
import StudentOnboarding from "./pages/student/Onboarding";
import StudentOverview from "./pages/student/Overview";
import StudentProfile from "./pages/student/Profile";
import BrowseInternships from "./pages/student/BrowseInternships";
import InternshipDetails from "./pages/student/InternshipDetails";
import MyApplications from "./pages/student/MyApplications";
import StudentMessages from "./pages/student/Messages";

import RecruiterRegister from "./pages/recruiter/Register";
import PendingApproval from "./pages/recruiter/PendingApproval";
import RecruiterLayout from "./components/layouts/RecruiterLayout";
import RecruiterOverview from "./pages/recruiter/Overview";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import PostInternship from "./pages/recruiter/PostInternship";
import ManageInternships from "./pages/recruiter/ManageInternships";
import Applicants from "./pages/recruiter/Applicants";
import RecruiterMessages from "./pages/recruiter/Messages";
import StudentMeetings from "./pages/student/Meetings";
import RecruiterMeetings from "./pages/recruiter/Meetings";

import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageRecruiters from "./pages/admin/ManageRecruiters";
import AdminManageInternships from "./pages/admin/ManageInternships";
import FloatingChat from "./components/chat/FloatingChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/recruiter" element={<RecruiterRegister />} />
            <Route path="/recruiter/pending" element={<PendingApproval />} />

            {/* Student Routes */}
            <Route path="/student/onboarding" element={<ProtectedRoute allowedRoles={["student"]}><StudentOnboarding /></ProtectedRoute>} />
            <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentLayout /></ProtectedRoute>}>
              <Route index element={<StudentOverview />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="internships" element={<BrowseInternships />} />
              <Route path="internships/:id" element={<InternshipDetails />} />
              <Route path="applications" element={<MyApplications />} />
              <Route path="messages" element={<StudentMessages />} />
              <Route path="meetings" element={<StudentMeetings />} />
            </Route>

            {/* Recruiter Routes */}
            <Route path="/recruiter" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterLayout /></ProtectedRoute>}>
              <Route index element={<RecruiterOverview />} />
              <Route path="profile" element={<CompanyProfile />} />
              <Route path="post" element={<PostInternship />} />
              <Route path="manage" element={<ManageInternships />} />
              <Route path="applicants" element={<Applicants />} />
              <Route path="messages" element={<RecruiterMessages />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="recruiters" element={<ManageRecruiters />} />
              <Route path="internships" element={<AdminManageInternships />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChat />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
