import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Header from "../Components/Header/Header";

const AdminDashboard = () => {
   return (
      <div className="flex">
         <Sidebar />
         <div className="w-full flex flex-col">
            <Header />
            <Outlet />
         </div>
      </div>
   );
};

export default AdminDashboard;
