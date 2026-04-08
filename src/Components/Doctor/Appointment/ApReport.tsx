import { Fieldset, MultiSelect, Textarea, TextInput } from "@mantine/core";
import { symptoms, tests } from "../../../Data/DropdownData";

const ApReport = () => {
   return (
      <div>
         <Fieldset
            className="grid gap-4 grid-cols-1"
            legend={<span className="text-lg font-medium text-primary-500">Personal information</span>}
            radius="md"
         >
            <MultiSelect withAsterisk label="Symptoms" placeholder="Pick symptoms" data={symptoms} className="w-full" />

            <MultiSelect withAsterisk label="Tests" placeholder="Pick tests" data={tests} className="w-full" />

            <TextInput withAsterisk label="Diagnosis" placeholder="Enter diagnosis" className="w-full" />
            <TextInput withAsterisk label="Referral" placeholder="Enter referral details" className="w-full" />

            <Textarea withAsterisk label="Notes" placeholder="Enter any additional notes" className="w-full" />
         </Fieldset>
      </div>
   );
};

export default ApReport;
