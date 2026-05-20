// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import AdminDashboard from "./components/pages/admin/AdminDashboard";

// Protected Admin Route
const AdminRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem("admin_authenticated") === "true";
  return isAdminAuthenticated ? children : <Navigate to="/MyValentineMessage" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/MyValentineMessage" element={<LandingPage />} />
        <Route 
          path="/MyValentineMessage/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/MyValentineMessage" replace />} />
      </Routes>
    </Router>
  );
}

export default App;