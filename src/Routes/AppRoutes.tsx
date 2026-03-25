import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import LoginPage from "../Pages/LoginPage";
import RegisterPage from "../Pages/RegisterPage";

const AppRoutes = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<AdminDashboard />}>
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
