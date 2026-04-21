import { Avatar } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDoctor } from "../../../Service/DoctorProfileService";
import { getUserProfile } from "../../../Service/UserService";
import useProtectedImage from "../../Utility/Dropzone/useProtectedImage";

const Welcome = () => {
   const user = useSelector((state: any) => state.user);
   const [picId, setPicId] = useState<string | null>(null);
   const [doctorInfo, setDoctorInfo] = useState<any>({});

   useEffect(() => {
      if (!user) return;
      getUserProfile(user.id)
         .then((data) => {
            setPicId(data);
         })
         .catch((error) => {
            console.log(error);
         });
      getDoctor(user.profileId)
         .then((data) => {
            console.log("getDoctor", data);
            setDoctorInfo(data);
         })
         .catch((error) => {
            console.log(error);
         });
   }, [user]);

   const url = useProtectedImage(picId);
   return (
      <div className="p-5 border shadow-sm rounded-xl bg-blue-50 flex flex-col gap-3">
         <div className="flex items-center justify-between">
            <div>
               <div>Welcome Back</div>
               <div className="text-3xl font-semibold text-blue-600">{user.name}</div>
               <div className="text-sm">
                  {doctorInfo.specialization}
                  {doctorInfo.department}
               </div>
            </div>
            <Avatar variant="filled" src={url} size={45} alt="it's me" />
         </div>
         <div>
            <div className="flex gap-5">
               <div className="p-3 rounded-xl bg-violet-200">
                  <div className="text-sm">Appointments</div>
                  <div className="text-lg font-semibold text-violet-600">120+</div>
               </div>

               <div className="p-3 rounded-xl bg-violet-200">
                  <div className="text-sm">Patients</div>
                  <div className="text-lg font-semibold text-violet-600">120+</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Welcome;
