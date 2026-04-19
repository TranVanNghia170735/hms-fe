import Appointment from "./Appointment";
import DiseaseChart from "./DiseaseChart";
import Doctors from "./Doctor";
import Medicines from "./Medicines";
import Patients from "./Patients";
import TopCard from "./TopCard";

const Dashboard = () => {
   return (
      <div className="flex flex-col gap-5 w-full">
         <TopCard />
         <div className="grid grid-cols-3 gap-5 w-full">
            <DiseaseChart />
            <Appointment />
            <Medicines />
         </div>

         <div className="grid grid-cols-2 gap-5">
            <Patients />
            <Doctors />
         </div>
      </div>
   );
};

export default Dashboard;
