import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

const AppRoutes = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route
               path="/login"
               element={
                  <PublicRoutes>
                     <LoginPage />
                  </PublicRoutes>
               }
            />
            <Route
               path="/register"
               element={
                  <PublicRoutes>
                     <RegisterPage />
                  </PublicRoutes>
               }
            />
            <Route
               path="/"
               element={
                  <ProtectedRoutes>
                     <AdminDashboard />
                  </ProtectedRoutes>
               }
            >
               <Route path="/dashboard" element={<div>Random</div>} />
               <Route path="/pharmacy" element={<div>Random</div>} />
               <Route path="/patients" element={<div>Random</div>} />
               <Route path="/appointments" element={<div>Random</div>} />
               <Route path="/doctors" element={<div>Random</div>} />
            </Route>
         </Routes>
      </BrowserRouter>
   );
};

export default AppRoutes;
