import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import NGODashboard from "./pages/NGODashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" />;
  return children;
};

// ← redirects to dashboard if already logged in
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  if (user?.role === "admin")     return <Navigate to="/admin" />;
  if (user?.role === "ngo")       return <Navigate to="/ngo" />;
  if (user?.role === "volunteer") return <Navigate to="/volunteer" />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#003554",
                color: "#fff",
                border: "1px solid #006494",
                fontFamily: "'DM Sans', sans-serif",
                borderRadius: "10px",
              },
              success: { iconTheme: { primary: "#33a6e0", secondary: "#003554" } },
              error:   { iconTheme: { primary: "#fca5a5", secondary: "#003554" } },
            }}
          />
          <Routes>
            {/* ← root and auth pages redirect to dashboard if already logged in */}
            <Route path="/"         element={<AuthRoute><Navigate to="/login" /></AuthRoute>} />
            <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />

            <Route path="/admin"     element={<RoleRoute allowedRoles={["admin"]}><AdminDashboard /></RoleRoute>} />
            <Route path="/ngo"       element={<RoleRoute allowedRoles={["ngo","admin"]}><NGODashboard /></RoleRoute>} />
            <Route path="/volunteer" element={<RoleRoute allowedRoles={["volunteer"]}><VolunteerDashboard /></RoleRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;