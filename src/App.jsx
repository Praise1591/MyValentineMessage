// src/App.jsx
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import AdminDashboard from "./components/pages/admin/AdminDashboard";

// Protected Admin Route
const AdminRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
  return isAdminAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;