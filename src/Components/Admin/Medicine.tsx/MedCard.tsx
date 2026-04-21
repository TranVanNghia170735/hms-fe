import { IconCurrencyRupee, IconMedicineSyrup, IconPill, IconStack2, IconVaccine } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const MedCard = ({ name, dosage, id, manufacturer, stock, category, type, unitPrice, onEdit }: any) => {
   const navigate = useNavigate();

   const getSeverity = (status: string) => {
      switch (status) {
         case "CANCELLED":
            return "danger";

         case "COMPLETED":
            return "success";

         case "SCHEDULED":
            return "info";

         case "negotiation":
            return "warning";
         default:
            return null;
      }
   };

   return (
      <div
         onClick={onEdit}
         className="border p-4 flex flex-col gap-2 hover:bg-primary-50 transition duration-300 ease-in-out rounded-xl  hover:shadow-[0_05px_1px_blue] !shadow-primary-500 cursor-pointer space-y-2"
      >
         <div className="flex text-xs items-center gap-2 ">
            <IconPill className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div>
               {name}
               <span className="text-gray-500">{manufacturer}</span>
            </div>
         </div>

         <div className="flex text-xs items-center gap-2 ">
            <IconPill className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div>
               <div className="text-gray-500">{dosage}</div>
            </div>
         </div>

         <div className="flex text-xs items-center gap-2 ">
            <IconStack2 className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div>
               <div className="text-gray-500">Stock: {stock}</div>
            </div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconMedicineSyrup className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {category}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconVaccine className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {type}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconVaccine className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div> {type}</div>
         </div>

         <div className="flex text-xs items-center gap-2">
            <IconCurrencyRupee className="text-primary-700 bg-primary-100 p-1 rounded-full" size={24} />
            <div>Price: {unitPrice}</div>
         </div>
      </div>
   );
};

export default MedCard;
