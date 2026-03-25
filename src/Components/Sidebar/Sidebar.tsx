import { Avatar, Text } from "@mantine/core";
import {
   IconCalendarCheck,
   IconHeartbeat,
   IconLayoutGrid,
   IconMoodHeart,
   IconStethoscope,
   IconVaccine,
} from "@tabler/icons-react";
import { NavLink } from "react-router-dom";

const links = [
   { name: "Dashboard", url: "/dashboard", icon: <IconLayoutGrid stroke={1.5} /> },
   { name: "Doctors", url: "/doctors", icon: <IconStethoscope stroke={1.5} /> },
   { name: "Patients", url: "/patients", icon: <IconMoodHeart stroke={1.5} /> },
   { name: "Appointments", url: "/appointments", icon: <IconCalendarCheck stroke={1.5} /> },
   { name: "Pharmacy", url: "/pharmacy", icon: <IconVaccine stroke={1.5} /> },
];

const Sidebar = () => {
   return (
      <div className="flex">
         <div className="w-64"></div>
         <div className="w-64 fixed h-screen overflow-y-auto hide-scrollbar bg-dark flex flex-col gap-7 items-center">
            <div className="fixed z-[500] py-3 bg-dark text-primary-400 flex gap-1 items-center">
               <IconHeartbeat size={40} stroke={2.5} />
               <span className="font-heading font-semibold text-3xl">Pulse</span>
            </div>
            <div className="flex flex-col mt-20 gap-5">
               <div className="flex flex-col gap-1 items-center">
                  <div className="p-1 bg-white rounded-full shadow-lg">
                     <Avatar variant="filled" src="./nghiatv8.png" size="xl" alt="it's me" />
                  </div>
                  <span className="font-medium text-white">Marshal</span>
                  <Text c="dimmed" size="xs" className="text-light">
                     Admin
                  </Text>
               </div>

               <div className="flex flex-col gap-1">
                  {links.map((link) => {
                     return (
                        <NavLink
                           key={link.url}
                           to={link.url}
                           className={({ isActive }) =>
                              `flex items-center gap-3 w-full font-medium text-light px-4 py-5 rounded-lg ${
                                 isActive ? "bg-primary-400 text-dark" : "hover:bg-gray-100 hover:text-dark text-light"
                              }`
                           }
                        >
                           {link.icon}
                           <span>{link.name}</span>
                        </NavLink>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Sidebar;
