import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import TaskManagement from "./Components/UserPage/TaskManagement";
import AdminDashboard from "./Components/AdminPage/AdminDashboard";
import UnAuth from "./Components/UnAuthPage/UnAuth";

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unAuth" element={<UnAuth />} />
      <Route
        path="/task-management"
        element={
          <ProtectedRoute component={TaskManagement} roleRequired="user" />
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute component={AdminDashboard} roleRequired="admin" />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
