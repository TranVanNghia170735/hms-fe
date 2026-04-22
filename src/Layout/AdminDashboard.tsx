import { useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Admin/Sidebar/Sidebar";
import Header from "../Components/Header/Header";

const AdminDashboard = () => {
   const matches = useMediaQuery("(min-width: 768px)");
   return (
      <div className="flex">
         {!matches && <Sidebar />}
         <div className="w-full flex flex-col">
            <Header />
            <Outlet />
         </div>
      </div>
   );
};

export default AdminDashboard;
