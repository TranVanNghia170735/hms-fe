import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";

const AppRoutes = () => {
   return (
      <BrowserRouter>
         <Routes>
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
