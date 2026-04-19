import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "../Layout/AdminDashboard";
import DoctorDashboard from "../Layout/DoctorDashboard";
import PatientDashboard from "../Layout/PatientDashboard";
import AdminDashboardPage from "../Pages/Admin/AdminDashboardPage";
import AdminDoctorPage from "../Pages/Admin/AdminDoctorPage";
import AdminInventoryPage from "../Pages/Admin/AdminInventoryPage";
import AdminMedicinePage from "../Pages/Admin/AdminMedicinePage";
import AdminPatientPage from "../Pages/Admin/AdminPatientPage";
import AdminSalesPage from "../Pages/Admin/AdminSalesPage";
import DoctorAppointmentDetailsPage from "../Pages/Doctor/DoctorAppointmentDetailsPage";
import DoctorAppointmentPage from "../Pages/Doctor/DoctorAppointmentPage";
import DoctorProfilePage from "../Pages/Doctor/DoctorProfilePage";
import LoginPage from "../Pages/LoginPage";
import NotFoundPage from "../Pages/NotFoundPage";
import PatientAppointmentPage from "../Pages/Patient/PatientAppointmentPage";
import PatientProfilePage from "../Pages/Patient/PatientProfilePage";
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
               path="/admin"
               element={
                  <ProtectedRoutes>
                     <AdminDashboard />
                  </ProtectedRoutes>
               }
            >
               <Route path="dashboard" element={<AdminDashboardPage />} />
               <Route path="medicine" element={<AdminMedicinePage />} />
               <Route path="inventory" element={<AdminInventoryPage />} />
               <Route path="sales" element={<AdminSalesPage />} />
               <Route path="patients" element={<AdminPatientPage />} />
               <Route path="doctors" element={<AdminDoctorPage />} />
            </Route>

            {/* Doctor */}
            <Route
               path="/doctor"
               element={
                  <ProtectedRoutes>
                     <DoctorDashboard />
                  </ProtectedRoutes>
               }
            >
               <Route path="dashboard" element={<div>Random</div>} />
               <Route path="profile" element={<DoctorProfilePage />} />
               <Route path="patients" element={<div>Random</div>} />
               <Route path="appointments" element={<DoctorAppointmentPage />} />
               <Route path="appointments/:id" element={<DoctorAppointmentDetailsPage />} />
               <Route path="pharmacy" element={<div>Random</div>} />
            </Route>

            {/* Patient */}
            <Route
               path="/patient"
               element={
                  <ProtectedRoutes>
                     <PatientDashboard />
                  </ProtectedRoutes>
               }
            >
               <Route path="dashboard" element={<div>Random</div>} />
               <Route path="profile" element={<PatientProfilePage />} />
               <Route path="appointments" element={<PatientAppointmentPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
         </Routes>
      </BrowserRouter>
   );
};

export default AppRoutes;
