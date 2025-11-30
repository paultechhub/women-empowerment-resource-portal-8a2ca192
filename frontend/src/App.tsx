import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
// import { HybridAuthProvider } from "@/contexts/HybridAuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LearningHub from "./pages/LearningHub";
import Mentorship from "./pages/Mentorship";
import Community from "./pages/Community";
import SuccessStories from "./pages/SuccessStories";
import CoursesPage from "./pages/CoursesPage";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import JobBoard from "./pages/JobBoard";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {/* <HybridAuthProvider> */}
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/learning-hub" element={<LearningHub />} />
            <Route path="/mentorship" element={<Mentorship />} />
            <Route path="/community" element={<Community />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/jobs" element={<JobBoard />} />
            <Route path="/admin" element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          {/* </HybridAuthProvider> */}
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
