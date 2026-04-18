import { Avatar, Divider } from "@mantine/core";
import { IconBriefcase, IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";

const DoctorCard = ({ name, email, dob, phone, address, department, specialization, totalExp }: any) => {
   return (
      <div className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl  hover:shadow-[0_05px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2">
         <div className="flex items-center gap-3">
            <Avatar size="lg" name={name} color="initials" variant="filled" />
            <div>
               <div className="text-sm">{name}</div>
               <div className="text-xs text-gray-600">
                  {specialization} &bull; {department}
               </div>
            </div>
         </div>
         <Divider />

         <div className="flex text-xs items-center gap-2 ">
            <IconMail className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {email}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconPhone className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {phone}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconMapPin className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {address}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconBriefcase className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {totalExp} Years</div>
         </div>
      </div>
   );
};

export default DoctorCard;
