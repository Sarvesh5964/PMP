import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumePage from './pages/ResumePage';
import PracticePage from './pages/PracticePage';
import InterviewPage from './pages/InterviewPage';
import PlacementDrivesPage from './pages/PlacementDrivesPage';
import ManageStudents from './pages/ManageStudents';
import ManageDrives from './pages/ManageDrives';
import ManageQuestions from './pages/ManageQuestions';
import ManageApplications from './pages/ManageApplications';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-slate-950"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar sidebarOpen={sidebarOpen} />
        <main className="flex-1 lg:pl-64 min-w-0 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/coding" element={<PracticePage />} />
            <Route path="/aptitude" element={<PracticePage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/drives" element={<PlacementDrivesPage />} />
            
            {/* Admin Dedicated Views */}
            <Route path="/admin/students" element={<ProtectedRoute adminOnly><ManageStudents /></ProtectedRoute>} />
            <Route path="/admin/drives" element={<ProtectedRoute adminOnly><ManageDrives /></ProtectedRoute>} />
            <Route path="/admin/questions" element={<ProtectedRoute adminOnly><ManageQuestions /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<ProtectedRoute adminOnly><ManageApplications /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<ProtectedRoute><Layout /></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
