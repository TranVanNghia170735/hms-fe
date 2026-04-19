import DiseaseChart from "../../Admin/Dashboard/DiseaseChart";
import Appointment from "./Appointment";
import Metrices from "./Metrices";
import PatientMetrics from "./PatientMetrics";
import Patients from "./Patients";
import Welcome from "./Welcome";

const Dashboard = () => {
   return (
      <div className="flex flex-col gap-5">
         <div className="grid grid-cols-2 gap-5">
            <Welcome />
            <Metrices />
         </div>

         <div className="grid grid-cols-3 gap-5">
            <DiseaseChart />
            <div className="col-span-2">
               <PatientMetrics />
            </div>
         </div>
         <div className="grid grid-cols-2 gap-5">
            <Patients />
            <Appointment />
         </div>
      </div>
   );
};

export default Dashboard;
