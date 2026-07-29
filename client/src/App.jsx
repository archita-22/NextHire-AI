import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";          
import Login from "./pages/Login";           
import Dashboard from "./pages/Dashboard";    
import UploadResume from "./pages/uploadResume"; 
import History from "./pages/history";        
import Settings from "./pages/settings";      
import InterviewPrep from "./pages/interviewprep"; // changed to lowercase i
import Layout from "./components/layout";      // changed to lowercase l (matches file)
import ProtectedRoute from "./components/protectedRoute"; // changed to lowercase p (matches file)
import ForgotPassword from "./pages/Forgotpassword"; // changed to lowercase p
import ResetPassword from "./pages/Resetpassword";   // changed to lowercase p

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<UploadResume />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="interview" element={<InterviewPrep />} />
      </Route>
    </Routes>
  );
}

export default App;