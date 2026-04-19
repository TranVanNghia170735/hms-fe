import { Avatar } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserProfile } from "../../../Service/UserService";
import useProtectedImage from "../../Utility/Dropzone/useProtectedImage";

const Welcome = () => {
   const user = useSelector((state: any) => state.user);
   const [picId, setPicId] = useState<string | null>(null);

   useEffect(() => {
      if (!user) return;
      console.log("getUserProfile", user.id);
      getUserProfile(user.id)
         .then((data) => {
            console.log("Data getUserProfile", +data);
            setPicId(data);
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
               <div className="text-sm">Surgery, Cadiology</div>
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
