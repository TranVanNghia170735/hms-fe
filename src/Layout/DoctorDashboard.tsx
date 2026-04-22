import { useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Doctor/Sidebar/Sidebar";
import Header from "../Components/Header/Header";

const DoctorDashboard = () => {
   const matches = useMediaQuery("(min-width: 768px)");
   return (
      <div className="flex">
         {!matches && <Sidebar />}
         <div className="w-full overflow-hidden flex flex-col">
            <Header />
            <Outlet />
         </div>
      </div>
   );
};

export default DoctorDashboard;
