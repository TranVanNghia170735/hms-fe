import { ScrollArea } from "@mantine/core";
import { IconFileReport, IconStethoscope, IconUsers } from "@tabler/icons-react";
import { appointments, data, doctorData, patientData } from "../../../Data/DashboardData";

const Appointment = () => {
   const cards = [
      {
         name: "Appointments",
         id: "appointments",
         color: "violet",
         bg: "bg-violet-100",
         icon: <IconFileReport />,
         data: data,
      },
      {
         name: "Patients",
         id: "patients",
         color: "orange",
         bg: "bg-violet-100",
         icon: <IconUsers />,
         data: patientData,
      },
      {
         name: "Doctors",
         id: "doctors",
         color: "green",
         bg: "bg-violet-100",
         icon: <IconStethoscope />,
         data: doctorData,
      },
   ];
   const card = (app: any) => {
      return (
         <div
            className="p-3 mb-3 border rounded-xl justify-between border-l-4 border-violet-500 shadow-md flex bg-violet-100 items-center"
            key={app.id}
         >
            <div className="flex-1">
               <div className="font-semibold">{app.patient}</div>
               <div className="text-sm text-gray-500">{app.reason}</div>
            </div>
            <div className="text-right">
               <div className="text-sm text-gray-500">{app.time}</div>
            </div>
         </div>
      );
   };

   return (
      <div className="p-3 border rounded-xl bg-violet-50 shadow-xl flex flex-col gap-3">
         <div className="text-xl font-semibold">Today's Appointment</div>
         <div>
            <ScrollArea.Autosize mah={300} mx="auto">
               {appointments.map((app) => card(app))}
            </ScrollArea.Autosize>
         </div>
      </div>
   );
};

export default Appointment;
